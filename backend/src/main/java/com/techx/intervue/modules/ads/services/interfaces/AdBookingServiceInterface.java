package com.techx.intervue.modules.ads.services.interfaces;

import com.techx.intervue.modules.ads.resources.RecruiterAdBookingResource;
import java.time.LocalDate;
import java.util.List;

public interface AdBookingServiceInterface {

    /**
     * Holds the weeks the moment an order is placed. Without this two companies could both pay for
     * the same week and only find out afterwards.
     */
    void reserve(
            Long companyId,
            Long orderId,
            Long orderItemId,
            Long servicePackageId,
            List<LocalDate> weeks);

    /** The money arrived, so the hold becomes a real booking. */
    void confirm(Long orderId);

    /** The order died, so the weeks go back on sale. */
    void release(Long orderId);

    List<RecruiterAdBookingResource> listForCompany(Long companyId);
}
