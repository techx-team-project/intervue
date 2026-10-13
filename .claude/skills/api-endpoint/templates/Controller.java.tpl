package com.techx.intervue.modules.${module}.controllers;

@RestController
@RequestMapping("/api/v1/${kebab-plural}")
@RequiredArgsConstructor
public class ${Entity}Controller extends BaseController {

    private final ${Entity}ServiceInterface service;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResource<${Entity}Resource>> create(
            @Valid @RequestBody ${Action}${Entity}Request request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(service.create(request, principal.getId()), "${Entity} created successfully");
    }
}
