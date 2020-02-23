import { useEffect, useMemo } from "react";

export type AnyCallSignature = (...args: any[]) => any;

export interface CallHolder<T extends AnyCallSignature> {
    implement: (implementation: T) => void;
    clear: () => void;
}

class DecoupledCall<T extends AnyCallSignature> {
    implementation: T | null = null;

    execute(...args: any[]): any {
        if (!this.implementation) {
            console.warn("trying to execute a call forward without being implemented");
        } else {
            return this.implementation(...args);
        }
    }

    implement(implementation: T) {
        if (!!this.implementation) {
            console.warn("call forward is already implemented, your previous implementation will be overridden")
        }

        this.implementation = implementation;
    }

    clear() {
        this.implementation = null;
    }
}

export function useCallHolder<T extends AnyCallSignature>(implementation: T, holder?: CallHolder<T>, deps?: any[]) {
    useEffect(() => {
        holder?.implement(implementation);
        return () => holder?.clear();
    }, [holder, ...(deps || [])]);
}

export function useCallForward<T extends AnyCallSignature>(deps: any[]): [T, CallHolder<T>] {
    return useMemo(() => {
        const call = new DecoupledCall<T>();
        
        const trigger = (...args: any[]) => {
            return call.execute(...args);
        };

        return [trigger as T, call];
    }, deps);
}