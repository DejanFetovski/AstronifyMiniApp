export function isYesterday(timestamp: number) {
    const givenDate = new Date(timestamp);

    // Get today's date
    const today = new Date();

    // Set today's time to 00:00:00
    today.setHours(0, 0, 0, 0);

    // Get yesterday's date by subtracting one day
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Set yesterday's time to 00:00:00
    yesterday.setHours(0, 0, 0, 0);

    // Check if the given date falls between yesterday's 00:00:00 and today's 00:00:00
    return givenDate >= yesterday && givenDate < today;
}

export function isToday(timestamp: number) {
    const givenDate = new Date(timestamp);

    // Get today's date
    const today = new Date();

    // Set today's time to 00:00:00
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date by adding one day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Set tomorrow's time to 00:00:00
    tomorrow.setHours(0, 0, 0, 0);

    // Check if the given date falls between today's 00:00:00 and tomorrow's 00:00:00
    return givenDate >= today && givenDate < tomorrow;
}