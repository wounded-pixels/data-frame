export const createRange = (start: number, stopBefore: number, step = 1): number[] => {
    const values = [];

    for (let ctr=start; ctr<stopBefore; ctr += step) {
        values.push(ctr);
    }

    return values;
};

export const removeValue = (array: any[], value: any) => {
    for (let ctr=array.length-1;ctr>=0;ctr--) {
        if (array[ctr] === value) {
            array.splice(ctr,1);
        }
    }
};

