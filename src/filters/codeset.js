
import cs from '@/store/modules/codeSet'
import * as dt from '@/types/codeset'

export const codeToName = function (pcode, subcode, tt) {
    if (tt != undefined) {
        pcode = subcode;
        subcode = tt;
    }
    let codes = cs.state[dt.STATE_CODES];
    if (codes != undefined) {
        var pCode = codes[pcode];
        if (pCode) {
            if (subcode != undefined) {
                var subCode = pCode.codeItemList.find(f => f.code == subcode);
                if (subCode) {
                    return subCode.name;
                }
                return subcode;
            } else {
                return pCode.nameCn;
            }
        }
    }
    return pcode;
}