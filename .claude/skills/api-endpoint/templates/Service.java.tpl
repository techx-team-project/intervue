package com.techx.intervue.modules.${module}.services.impl;

@Slf4j
@Service
@RequiredArgsConstructor
public class ${Entity}Service implements ${Entity}ServiceInterface {

    private final ${Entity}Repository repository;

    @Override
    @Transactional
    public ${Entity}Resource create(${Action}${Entity}Request request, Long currentUserId) {
        ${Entity} entity = ${Entity}.builder().ownerId(currentUserId).title(request.title()).build();
        return ${Entity}Resource.from(repository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public ${Entity}Resource getOwned(Long id, Long currentUserId) {
        return repository
                .findByIdAndOwnerId(id, currentUserId)
                .map(${Entity}Resource::from)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
