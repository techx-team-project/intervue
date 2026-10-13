package com.techx.intervue.modules.${module}.services.impl;

@Slf4j
@Service
@RequiredArgsConstructor
public class ${Entity}Service implements ${Entity}ServiceInterface {

    private final ${Entity}Repository repository;

    @Override
    @Transactional
    public ${Entity}Resource create(${Action}${Entity}Request request, Long currentUserId) {
        // 1. business rules (e.g. company verified, identity verified)
        // 2. persist
        // 3. map to Resource; never return the entity
        throw new UnsupportedOperationException("TODO");
    }

    @Override
    @Transactional(readOnly = true)
    public ${Entity}Resource getOwned(Long id, Long currentUserId) {
        // Ownership check = IDOR protection: 404 when not owned.
        return repository
                .findByIdAndOwnerId(id, currentUserId)
                .map(${Entity}Resource::from)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
