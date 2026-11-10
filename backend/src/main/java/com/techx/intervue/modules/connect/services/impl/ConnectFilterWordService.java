package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.connect.entities.ConnectFilterWord;
import com.techx.intervue.modules.connect.mappers.ConnectMapper;
import com.techx.intervue.modules.connect.repositories.ConnectFilterWordRepository;
import com.techx.intervue.modules.connect.requests.CreateFilterWordRequest;
import com.techx.intervue.modules.connect.requests.UpdateFilterWordRequest;
import com.techx.intervue.modules.connect.resources.ConnectFilterWordResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectFilterWordServiceInterface;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ConnectFilterWordService implements ConnectFilterWordServiceInterface {

    private final ConnectFilterWordRepository filterWordRepository;
    private final ConnectMapper connectMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ConnectFilterWordResource> list(Pageable pageable) {
        return filterWordRepository.findAll(pageable).map(connectMapper::toFilterWordResource);
    }

    @Override
    public ConnectFilterWordResource create(CreateFilterWordRequest request) {
        validatePattern(request.pattern(), request.regex());

        ConnectFilterWord entity =
                ConnectFilterWord.builder()
                        .pattern(request.pattern().trim())
                        .regex(request.regex())
                        .severity(request.severity())
                        .active(request.active())
                        .note(request.note() != null ? request.note().trim() : null)
                        .build();

        ConnectFilterWord saved = filterWordRepository.save(entity);
        return connectMapper.toFilterWordResource(saved);
    }

    @Override
    public ConnectFilterWordResource update(Long id, UpdateFilterWordRequest request) {
        validatePattern(request.pattern(), request.regex());

        ConnectFilterWord entity =
                filterWordRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        entity.setPattern(request.pattern().trim());
        entity.setRegex(request.regex());
        entity.setSeverity(request.severity());
        entity.setActive(request.active());
        entity.setNote(request.note() != null ? request.note().trim() : null);

        ConnectFilterWord saved = filterWordRepository.save(entity);
        return connectMapper.toFilterWordResource(saved);
    }

    @Override
    public void delete(Long id) {
        ConnectFilterWord entity =
                filterWordRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        filterWordRepository.delete(entity);
    }

    @Override
    public ConnectFilterWordResource toggleActive(Long id) {
        ConnectFilterWord entity =
                filterWordRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        entity.setActive(!entity.isActive());
        ConnectFilterWord saved = filterWordRepository.save(entity);
        return connectMapper.toFilterWordResource(saved);
    }

    private void validatePattern(String pattern, boolean regex) {
        if (regex) {
            try {
                Pattern.compile(pattern);
            } catch (PatternSyntaxException exception) {
                throw new AppException(ErrorCode.VALIDATION_FAILED);
            }
        }
    }
}
