package com.techx.intervue.modules.candidate.credits.services;

import com.techx.intervue.common.policy.FreeQuotaPolicyInterface;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.credits.entities.CandidateCreditBalance;
import com.techx.intervue.modules.candidate.credits.entities.CandidateCreditTransaction;
import com.techx.intervue.modules.candidate.credits.enums.CreditTransactionType;
import com.techx.intervue.modules.candidate.credits.repositories.CandidateCreditBalanceRepository;
import com.techx.intervue.modules.candidate.credits.repositories.CandidateCreditTransactionRepository;
import com.techx.intervue.modules.candidate.credits.resources.CandidateCreditSummaryResource;
import com.techx.intervue.modules.candidate.credits.resources.CandidateCreditTransactionResource;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileLookup;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateCreditService implements CandidateCreditServiceInterface {

    private final CandidateCreditBalanceRepository balanceRepository;
    private final CandidateCreditTransactionRepository transactionRepository;
    private final CandidateProfileLookup candidateProfileLookup;
    private final FreeQuotaPolicyInterface freeQuotaPolicy;

    @Override
    @Transactional
    public int getBalance(Long candidateId) {
        return getOrCreateBalance(candidateId).getBalance();
    }

    @Override
    @Transactional
    public void charge(
            CandidateProfile candidate,
            int amount,
            String feature,
            String referenceId,
            String description) {
        if (amount <= 0) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        CandidateCreditBalance balance = getOrCreateBalance(candidate);
        if (balance.getBalance() < amount) {
            log.warn(
                    "Candidate {} has insufficient credits (balance: {}, needed: {}) for feature {}",
                    candidate.getId(),
                    balance.getBalance(),
                    amount,
                    feature);
            throw new AppException(ErrorCode.INSUFFICIENT_CREDITS);
        }

        int newBalance = balance.getBalance() - amount;
        balance.setBalance(newBalance);
        balanceRepository.save(balance);

        CandidateCreditTransaction transaction =
                CandidateCreditTransaction.builder()
                        .candidate(candidate)
                        .amount(-amount)
                        .balanceAfter(newBalance)
                        .type(CreditTransactionType.CHARGE)
                        .feature(feature)
                        .referenceId(referenceId)
                        .description(description)
                        .build();
        transactionRepository.save(transaction);

        log.info(
                "Charged {} credits from candidate {} for feature {} (new balance: {})",
                amount,
                candidate.getId(),
                feature,
                newBalance);
    }

    @Override
    @Transactional
    public void refund(
            CandidateProfile candidate,
            int amount,
            String feature,
            String referenceId,
            String description) {
        if (amount <= 0) return;

        CandidateCreditBalance balance = getOrCreateBalance(candidate);
        int newBalance = balance.getBalance() + amount;
        balance.setBalance(newBalance);
        balanceRepository.save(balance);

        CandidateCreditTransaction transaction =
                CandidateCreditTransaction.builder()
                        .candidate(candidate)
                        .amount(amount)
                        .balanceAfter(newBalance)
                        .type(CreditTransactionType.REFUND)
                        .feature(feature)
                        .referenceId(referenceId)
                        .description(description)
                        .build();
        transactionRepository.save(transaction);

        log.info(
                "Refunded {} credits to candidate {} for feature {} (new balance: {})",
                amount,
                candidate.getId(),
                feature,
                newBalance);
    }

    @Override
    @Transactional
    public CandidateCreditSummaryResource topup(Long candidateUserId, int amount) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (amount <= 0) {
            throw new AppException(ErrorCode.VALIDATION_FAILED);
        }

        CandidateProfile profile = candidateProfileLookup.require(candidateUserId);
        CandidateCreditBalance balance = getOrCreateBalance(profile);

        int newBalance = balance.getBalance() + amount;
        balance.setBalance(newBalance);
        balanceRepository.save(balance);

        CandidateCreditTransaction transaction =
                CandidateCreditTransaction.builder()
                        .candidate(profile)
                        .amount(amount)
                        .balanceAfter(newBalance)
                        .type(CreditTransactionType.TOPUP)
                        .feature("TOPUP")
                        .referenceId("TOPUP-" + System.currentTimeMillis())
                        .description("Nạp thành công " + amount + " credit vào tài khoản ứng viên")
                        .build();
        transactionRepository.save(transaction);

        return buildSummary(profile, newBalance);
    }

    @Override
    @Transactional
    public CandidateCreditSummaryResource getSummary(Long candidateUserId) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        CandidateProfile profile = candidateProfileLookup.require(candidateUserId);
        CandidateCreditBalance balance = getOrCreateBalance(profile);
        return buildSummary(profile, balance.getBalance());
    }

    private CandidateCreditBalance getOrCreateBalance(Long candidateId) {
        return balanceRepository
                .findById(candidateId)
                .orElseGet(
                        () -> {
                            CandidateProfile profile =
                                    candidateProfileLookup.requireByProfileId(candidateId);
                            return initializeStarterBalance(profile);
                        });
    }

    private CandidateCreditBalance getOrCreateBalance(CandidateProfile profile) {
        return balanceRepository
                .findById(profile.getId())
                .orElseGet(() -> initializeStarterBalance(profile));
    }

    private CandidateCreditBalance initializeStarterBalance(CandidateProfile profile) {
        int starterCredits = freeQuotaPolicy.current().candidateStarterCredits();
        CandidateCreditBalance newBalance =
                CandidateCreditBalance.builder().candidate(profile).balance(starterCredits).build();
        CandidateCreditBalance saved = balanceRepository.save(newBalance);

        if (starterCredits > 0) {
            CandidateCreditTransaction grantTx =
                    CandidateCreditTransaction.builder()
                            .candidate(profile)
                            .amount(starterCredits)
                            .balanceAfter(starterCredits)
                            .type(CreditTransactionType.INITIAL_GRANT)
                            .feature("STARTER_PACKAGE")
                            .referenceId("WELCOME")
                            .description(
                                    "Tặng "
                                            + starterCredits
                                            + " credit trải nghiệm đánh giá CV ban đầu")
                            .build();
            transactionRepository.save(grantTx);
        }

        return saved;
    }

    private CandidateCreditSummaryResource buildSummary(
            CandidateProfile profile, int currentBalance) {
        List<CandidateCreditTransaction> allTransactions =
                transactionRepository.findByCandidateIdOrderByCreatedAtDesc(profile.getId());

        int totalCharged =
                allTransactions.stream()
                        .filter(t -> t.getType() == CreditTransactionType.CHARGE)
                        .mapToInt(t -> Math.abs(t.getAmount()))
                        .sum();

        int totalRefunded =
                allTransactions.stream()
                        .filter(t -> t.getType() == CreditTransactionType.REFUND)
                        .mapToInt(CandidateCreditTransaction::getAmount)
                        .sum();

        List<CandidateCreditTransactionResource> recent =
                transactionRepository
                        .findByCandidateIdOrderByCreatedAtDesc(
                                profile.getId(), PageRequest.of(0, 10))
                        .stream()
                        .map(
                                t ->
                                        CandidateCreditTransactionResource.builder()
                                                .id(t.getId())
                                                .amount(t.getAmount())
                                                .balanceAfter(t.getBalanceAfter())
                                                .type(t.getType())
                                                .feature(t.getFeature())
                                                .referenceId(t.getReferenceId())
                                                .description(t.getDescription())
                                                .createdAt(t.getCreatedAt())
                                                .build())
                        .toList();

        return CandidateCreditSummaryResource.builder()
                .candidateId(profile.getId())
                .currentBalance(currentBalance)
                .totalCharged(totalCharged)
                .totalRefunded(totalRefunded)
                .recentTransactions(recent)
                .build();
    }
}
