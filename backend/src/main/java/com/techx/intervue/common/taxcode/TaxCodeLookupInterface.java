package com.techx.intervue.common.taxcode;

import java.util.Optional;

public interface TaxCodeLookupInterface {

    Optional<TaxCodeRecord> find(String taxCode);
}
