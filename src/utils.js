
// your very basic ajax call wrapped in a promise!
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

// for formating elapsed time
export const formatTime = (time) => {
    const hours = Math.floor(time / (3600 * 1000));
    const minutes = Math.floor(time / (60 * 1000)) % 60;
    const seconds = Math.floor(time / 1000) % 60;

    const segments =
      (hours > 0) ?
        [hours, minutes, seconds] :
        [minutes, seconds];

    return segments
        .map((n) => `${n}`.padStart(2, '0'))
        .join(':')
}
