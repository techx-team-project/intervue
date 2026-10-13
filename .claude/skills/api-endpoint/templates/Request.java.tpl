package com.techx.intervue.modules.${module}.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ${Action}${Entity}Request(
        @NotBlank @Size(max = 255) String title
        /* add fields + constraints */ ) {}
