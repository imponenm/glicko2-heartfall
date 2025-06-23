export = rate;
/**
 * @param {number} rating Rating.
 * @param {number} rd Rating deviation.
 * @param {number} sigma Rating volatility.
 * @param {readonly Opponent[]} opponents Opponents.
 * @param {{ rating?: number; tau?: number; }} [options] Options.
 * @returns {{ rating: number; rd: number; vol: number; }}
 */
declare function rate(rating: number, rd: number, sigma: number, opponents: readonly Opponent[], options?: {
    rating?: number;
    tau?: number;
}): {
    rating: number;
    rd: number;
    vol: number;
};
declare namespace rate {
    export { Opponent, ScaledOpponent };
}
type Opponent = [rating: number, rd: number, score: number];
type ScaledOpponent = {
    muj: number;
    phij: number;
    gphij: number;
    emmp: number;
    score: number;
};
