package com.techx.intervue.common.seed;

public final class IdSequence {

    private long current;

    IdSequence(long current) {
        this.current = current;
    }

    public long next() {
        return ++current;
    }
}
