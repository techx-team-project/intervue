package com.techx.intervue.common.geolocation;

public final class GeoDistance {

    private static final double EARTH_RADIUS_KM = 6371.0088;
    private static final double KM_PER_DEGREE = 111.32;

    private GeoDistance() {}

    public static double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2)
                        + Math.cos(Math.toRadians(lat1))
                                * Math.cos(Math.toRadians(lat2))
                                * Math.sin(dLng / 2)
                                * Math.sin(dLng / 2);
        return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
    }

    public static double latitudeDelta(double radiusKm) {
        return radiusKm / KM_PER_DEGREE;
    }

    public static double longitudeDelta(double radiusKm, double latitude) {
        double scale = Math.max(Math.cos(Math.toRadians(latitude)), 0.01);
        return radiusKm / (KM_PER_DEGREE * scale);
    }
}
