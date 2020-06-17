
import axios from 'axios';
import Base64 from 'base-64';
import moment from 'moment-timezone';

const handleClock = (params, successCallback = () => { }, errorCallback = () => { }) => {
    let value = params.attendData;
    let PERSON_ID = value.detailpersonid + ':' + '(Allah) Yang Maha Pengasih'
    let FULL_NAME = value.fullname + ':' + 'Yang telah mengajarkan Al-Quran'
    let EMP_NO = value.detailempno + ':' + 'Dia menciptakan manusia'
    let EMAIL = value.detailemail + ':' + 'mengajarnya pandai berbicara'
    let LONG = params.longitude + ':' + 'Matahari dan bulan beredar menurut perhitungan'
    let LAT = params.latitude + ':' + 'dan tetumbuhan dan pepohonan, keduanya tunduk (kepada-Nya)'
    let TYPE = params.type
    let TOKEN = value.detailToken
    let ADDRESS = params.address;
    var txnya = moment.tz.guess();
    let USERZONE = moment(moment().format("YYYY-MM-DD")).tz(txnya).format('Z');

    let token = Base64.encode(PERSON_ID) + ':' + Base64.encode(FULL_NAME) + ':' + Base64.encode(EMP_NO) + ':' + Base64.encode(EMAIL) + ':' + Base64.encode(LONG) + ':' + Base64.encode(LAT) + ':' + Base64.encode(TYPE) + ':' + Base64.encode(TOKEN) + ':' + Base64.encode(ADDRESS) + ':' + Base64.encode(USERZONE);
    let tokenKedua = Base64.encode(token);
    let tokenKetiga = Base64.encode('p%5GtyVzGda0%taj' + tokenKedua);

    let payload = {
        TOKEN: tokenKetiga
    }

    let urlIattend = params.url;

    // console.log('toke', PERSON_ID, FULL_NAME, EMP_NO, EMAIL, LONG, LAT, TYPE, TOKEN, ADDRESS, USERZONE)
    const request = axios.post(urlIattend, payload)
    request
        .then(async response => {
            let PARAM_ID = response.data.data
            console.log(`${TYPE} success -> ${value.detailemail} : `, response.data)
            let inserafterattend = inserLogAfterAttend(value.detailemail, PARAM_ID)

            successCallback();
        })
        .catch(async (err) => {
            console.log(`error ${TYPE} ${value.detailemail} :`, err);
            errorCallback();
        })
}

const inserLogAfterAttend = (paramEmail, paramId) => {
    let request_date = moment().format("YYYY-MM-DD")
    let request_time = moment().format("h:mm:ss a")
    let email = paramEmail
    let activity = "attend : " + paramId

    let token = Base64.encode(request_date) + ':' + Base64.encode(request_time) + ':' + Base64.encode(email) + ':' + Base64.encode(activity)
    let tokenKedua = Base64.encode(token)

    let payload = {
        userToken: tokenKedua

    }

    let urlIattend = "https://portalmobile.dexagroup.com/api/statistik/mobile/v1/insertLogActivity"

    const request = axios.post(urlIattend, payload)
    request
        .then(response => {
            console.log(`log ${email} : ${response.data}`)
            return true
        })
        .catch((err) => {
            console.log(`error log ${email} :`, err)
        })
}


const checkToday = value => {
    console.log("tokennya", value);

    let token = Base64.encode(value);
    let tokenKedua = Base64.encode(token);
    let tokenKetiga = Base64.encode('p%5GtyVzGda0%taj' + tokenKedua);

    let payload3 = {
        TOKEN: tokenKetiga
    };

    let urlIattend = "https://portalmobile.dexagroup.com/api/hrd/mobile/v1/cekToday";

    const request = axios.post(urlIattend, payload3, {

    })
    request
        .then(response => {
            // -Save the JWT token
            console.log("balikan cekToday", response.data);
            // alert("Check in success");

            if (response.data.jumlah === 0) {
                //false
            } else {
                //true
            }

        })
        .catch((err) => {
            //  dispatch(authError('bad login info'))
            console.log("AXIOS ERROR: ", err);

        });

}

export { checkToday, handleClock };