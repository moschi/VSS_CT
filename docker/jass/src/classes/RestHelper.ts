
const ERROR_OCCURED = 'Es ist ein Fehler aufgetretten, bitte versuchen sie es erneut.';


const request = (method:string, route: string, callback?:(data:object) => void, errorHandling?:(error:object)=> void)=>{
    fetch('/v1/' + route, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (response.ok) {
            response.json().then((data:any) => {
                if(callback) {
                    callback(data);
                }
            });
        } else {
            throw new Error(ERROR_OCCURED);
        }
    }).catch((error) => {
        if(errorHandling){
            errorHandling(error);
        }
    });
};

export const get = (route: string, callback?:(data:object)=>void, errorHandling?:(error:object)=>void) => {
    request("GET", route, callback, errorHandling);
};

export const post = (route: string, callback?:(data:object)=>void, errorHandling?:(error:object)=>void) =>{
    request("POST", route, callback, errorHandling);
};