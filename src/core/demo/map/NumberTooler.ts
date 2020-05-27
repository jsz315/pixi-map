export class NumberTooler{

    /**
     * 2进制字符串转16进制字符串，结果不带0x
     * @param str 
     */
    static string2T16(str:string):string{
        var n = parseInt(str, 2);
        return n.toString(16);
    }

    /**
     * 16进制字符串转2进制字符串
     * @param str 
     */
    static string16T2(str:string):string{
        var reg = /0x/i;
        if(!reg.test(str)){
            str = "0x" + str;
        }
        return Number(str).toString(2);
    }

    /**
     * 自动补0字符串
     * @param str 需要补0的字符串
     * @param total 需要返回的总长度
     */
    static addZero(str:string, total:number):string{
        var list = [];
        for(var i = 0; i < total; i++){
            list.push(0);
        }
        return (list.join("") + str).substr(-total);
    }
}