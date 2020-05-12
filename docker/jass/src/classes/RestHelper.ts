const ERROR_OCCURED =
    'Es ist ein Fehler aufgetretten, bitte versuchen sie es erneut.';

const request = (
    method: string,
    route: string,
    extractBody: boolean,
    callback?: (data?: object) => void,
    errorHandling?: (error: Error) => void,
    body?: {}
) => {
    fetch('/v1/' + route, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((response) => {
            if (response.ok) {
                if (extractBody) {
                    response.json().then((data: any) => {
                        if (callback) {
                            callback(data);
                        }
                    });
                } else {
                    if (callback) {
                        callback();
                    }
                }
            } else {
                throw new Error(ERROR_OCCURED);
            }
        })
        .catch((error) => {
            if (errorHandling) {
                errorHandling(error);
            }
        });
};

export const get = (
    route: string,
    callback?: (data?: object) => void,
    errorHandling?: (error: Error) => void
) => {
    request('GET', route, true, callback, errorHandling);
};

export const post = (
    route: string,
    callback?: (data?: object) => void,
    errorHandling?: (error: Error) => void,
    body?: {}
) => {
    request('POST', route, true, callback, errorHandling, body);
};

export const del = (
    route: string,
    callback?: (data?: object) => void,
    errorHandling?: (error: Error) => void
) => {
    request('DELETE', route, false, callback, errorHandling);
};

export const update = (
    route: string,
    callback?: (data?: object) => void,
    errorHandling?: (error: Error) => void,
    body?: {}
) => {
    request('PUT', route, false, callback, errorHandling, body);
};
