export function calculateAccountAge(createdAt: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - createdAt.getTime();

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
        return `${diffInYears} tahun ${diffInMonths % 12} bulan`;
    } else if (diffInMonths > 0) {
        return `${diffInMonths} bulan ${diffInDays % 30} hari`;
    } else {
        return `${diffInDays} hari`;
    }
}