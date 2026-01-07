import { gt } from 'semver';

export const isNewerVersion = (current: string, remote: string): boolean => {
    try {
        return gt(remote, current);
    } catch (e) {
        console.error(e);
        return false;
    }
};