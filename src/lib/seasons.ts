export type Season = 'Summer' | 'Monsoon' | 'Winter';

/**
 * Determines the current season in India based on the month.
 * This is a simplified model.
 * @returns {Season} The current season.
 */
export function getCurrentIndianSeason(): Season {
  const month = new Date().getMonth(); // 0-11 (Jan-Dec)

  if (month >= 2 && month <= 5) {
    // March to June
    return 'Summer';
  } else if (month >= 6 && month <= 9) {
    // July to October
    return 'Monsoon';
  } else {
    // November to February
    return 'Winter';
  }
}
