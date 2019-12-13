
export const http = (url, method = 'GET') => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error(`HTTP error ${xhr.status}`));
                }
            }
        }

        xhr.open(method, url, true);
        xhr.send();
    });
}
