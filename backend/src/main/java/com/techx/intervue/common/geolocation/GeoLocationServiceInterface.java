package com.techx.intervue.common.geolocation;

public interface GeoLocationServiceInterface {

    String resolveLocation(String ip);

    String resolveCachedOrLocalLocation(String ip);
}
