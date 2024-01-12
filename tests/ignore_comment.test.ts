import {ignoreComment} from "../app";




test("ignore commnet", () => {
    const testData = `
       Clock
       House
       Tree and Flower
       Car # comment
       Bus # # # # ##
       # line comment
       
       after Empty Line
       
    `;

    // const result = ignoreComment2(testData.split('\n'));

    // console.log(result);
    //
    // expect(result).toEqual([
    //     "Clock",
    //     "House",
    //     "Tree and Flower",
    //     "Car",
    //     "Bus",
    //     "after Empty Line",
    // ]);
});
