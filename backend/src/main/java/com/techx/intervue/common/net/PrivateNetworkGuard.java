package com.techx.intervue.common.net;

import java.net.InetAddress;

public final class PrivateNetworkGuard {

    private PrivateNetworkGuard() {}

    public static boolean isPrivateOrLocal(String ip) {
        if ("127.0.0.1".equals(ip)
                || "0:0:0:0:0:0:0:1".equals(ip)
                || "::1".equals(ip)
                || "localhost".equalsIgnoreCase(ip)) {
            return true;
        }
        try {
            return isPrivateOrLocal(InetAddress.ofLiteral(ip));
        } catch (IllegalArgumentException e) {
            return ip.startsWith("10.")
                    || ip.startsWith("192.168.")
                    || ip.startsWith("172.")
                    || ip.startsWith("169.254.");
        }
    }

    public static boolean isPrivateOrLocal(InetAddress address) {
        return address.isLoopbackAddress()
                || address.isSiteLocalAddress()
                || address.isLinkLocalAddress()
                || address.isAnyLocalAddress();
    }
}
