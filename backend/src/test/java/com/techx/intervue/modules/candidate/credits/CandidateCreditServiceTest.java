package com.techx.intervue.modules.candidate.credits;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.credits.entities.CandidateCreditBalance;
import com.techx.intervue.modules.candidate.credits.entities.CandidateCreditTransaction;
import com.techx.intervue.modules.candidate.credits.repositories.CandidateCreditBalanceRepository;
import com.techx.intervue.modules.candidate.credits.repositories.CandidateCreditTransactionRepository;
import com.techx.intervue.modules.candidate.credits.resources.CandidateCreditSummaryResource;
import com.techx.intervue.modules.candidate.credits.services.CandidateCreditService;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileLookup;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CandidateCreditServiceTest {

    private CandidateCreditBalanceRepository balanceRepository;
    private CandidateCreditTransactionRepository transactionRepository;
    private CandidateProfileLookup candidateProfileLookup;
    private CandidateCreditService creditService;

    @BeforeEach
    void setUp() {
        balanceRepository = mock(CandidateCreditBalanceRepository.class);
        transactionRepository = mock(CandidateCreditTransactionRepository.class);
        candidateProfileLookup = mock(CandidateProfileLookup.class);
        creditService =
                new CandidateCreditService(
                        balanceRepository, transactionRepository, candidateProfileLookup);
    }

    @Test
    void getBalance_initializesWithStarterCreditsIfNew() {
        CandidateProfile profile = CandidateProfile.builder().id(12L).userId(55L).build();
        when(balanceRepository.findById(12L)).thenReturn(Optional.empty());
        when(candidateProfileLookup.requireByProfileId(12L)).thenReturn(profile);
        when(balanceRepository.save(any(CandidateCreditBalance.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        int balance = creditService.getBalance(12L);

        assertThat(balance).isEqualTo(CandidateCreditService.INITIAL_STARTER_CREDITS);
        verify(transactionRepository).save(any(CandidateCreditTransaction.class));
    }

    @Test
    void charge_deductsCreditAndRecordsTransaction() {
        CandidateProfile profile = CandidateProfile.builder().id(12L).userId(55L).build();
        CandidateCreditBalance balance =
                CandidateCreditBalance.builder().candidate(profile).balance(5).build();
        when(balanceRepository.findById(12L)).thenReturn(Optional.of(balance));

        creditService.charge(profile, 1, "CV_REVIEW_LEVEL_3", "job-10", "Level 3 CV Review");

        assertThat(balance.getBalance()).isEqualTo(4);
        verify(balanceRepository).save(balance);
        verify(transactionRepository).save(any(CandidateCreditTransaction.class));
    }

    @Test
    void charge_insufficientCredits_throwsException() {
        CandidateProfile profile = CandidateProfile.builder().id(12L).userId(55L).build();
        CandidateCreditBalance balance =
                CandidateCreditBalance.builder().candidate(profile).balance(0).build();
        when(balanceRepository.findById(12L)).thenReturn(Optional.of(balance));

        assertThatThrownBy(
                        () ->
                                creditService.charge(
                                        profile, 1, "CV_REVIEW_LEVEL_3", "job-10", "Level 3"))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INSUFFICIENT_CREDITS);
    }

    @Test
    void refund_restoresBalanceAndRecordsRefundTransaction() {
        CandidateProfile profile = CandidateProfile.builder().id(12L).userId(55L).build();
        CandidateCreditBalance balance =
                CandidateCreditBalance.builder().candidate(profile).balance(2).build();
        when(balanceRepository.findById(12L)).thenReturn(Optional.of(balance));

        creditService.refund(profile, 1, "CV_REVIEW_LEVEL_3", "job-10", "Automatic refund");

        assertThat(balance.getBalance()).isEqualTo(3);
        verify(balanceRepository).save(balance);
        verify(transactionRepository).save(any(CandidateCreditTransaction.class));
    }

    @Test
    void topup_increasesBalance() {
        CandidateProfile profile = CandidateProfile.builder().id(12L).userId(55L).build();
        CandidateCreditBalance balance =
                CandidateCreditBalance.builder().candidate(profile).balance(3).build();
        when(candidateProfileLookup.require(55L)).thenReturn(profile);
        when(balanceRepository.findById(12L)).thenReturn(Optional.of(balance));
        when(transactionRepository.findByCandidateIdOrderByCreatedAtDesc(12L))
                .thenReturn(List.of());

        CandidateCreditSummaryResource summary = creditService.topup(55L, 10);

        assertThat(balance.getBalance()).isEqualTo(13);
        assertThat(summary.currentBalance()).isEqualTo(13);
        verify(transactionRepository).save(any(CandidateCreditTransaction.class));
    }
}
