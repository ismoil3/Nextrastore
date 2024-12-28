let arr =[1,"f",false,"Ds"]

function createobj(arr) {
    let obj = {}
    arr.forEach((el,i) => {
        obj[i] = el
    });
    return obj
}
console.log(createobj(arr));
