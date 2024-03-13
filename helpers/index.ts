
export const recordScreen = async($button: HTMLButtonElement | null) : Promise<void> =>{
    if($button){
        try {
            const media = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } },
                audio: true,
            });

            const mediarecorder = new MediaRecorder(media, {
                mimeType: 'video/webm'
            });
            mediarecorder.start();
            $button.disabled = true;

            const [video] = media.getVideoTracks();
            video.addEventListener("ended", () => {
                mediarecorder.stop();
                $button.disabled = false;
            });

            mediarecorder.addEventListener("dataavailable", (e) => {
                const link = document.createElement("a")
                link.href = URL.createObjectURL(e.data)
                link.download = `video${Date.now()}.webm`
                link.click();
            });
        } catch (error) {
            console.log(error);
        }
	}
}

export const recordScreenMicrophone = async($button: HTMLButtonElement | null): Promise<void> =>{
    if($button){
        let data:any = [];
        try {
            //Get the video and audio player
            const media = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false})
            //Get the microphone
            const audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

            //Combine the audio and video
            const combine = new MediaStream([...media.getTracks(), ...audio.getTracks()]);

            const mediarecorder = new MediaRecorder(combine);

            mediarecorder.start()
            $button.disabled = true;
            const [video] = media.getVideoTracks()
            video.addEventListener("ended", () => {
                mediarecorder.stop();
                $button.disabled = false;
            });
            
            mediarecorder.ondataavailable = (e) => { 
                data.push(e.data); 
            }; 

            mediarecorder.onstop = () => {
                let blobData = new Blob(data, { type: 'video/mp4' }); 
                // Assign the url to the output video tag and anchor  
                const link = document.createElement("a")
                link.href = URL.createObjectURL(blobData)
                link.download = `video${Date.now()}.mp4`
                link.click(); 
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export const recordScreenMicroCamera = async($button: HTMLButtonElement | null): Promise<MediaRecorder> =>{
    let dataReturn = [];
    if($button){
        try {
            //Get the microphone
            const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user" } });
            //Combine the audio and video
            const combine = new MediaStream([...media.getTracks()]);
            
            const mediarecorder = new MediaRecorder(combine);
            
            mediarecorder.start()
            $button.disabled = true;

            dataReturn.push(mediarecorder);
        } catch (error) {
            console.log(error);
        }
    }
    return dataReturn[0];
}
export const endRecording = ($button: HTMLButtonElement | null, mediarecorder: MediaRecorder): void => {
    if($button){
        let data:any = [];
        try {
            mediarecorder.stop();
            $button.disabled = true;

            mediarecorder.ondataavailable = (e) => { 
                data.push(e.data); 
            };
            
            mediarecorder.onstop= () => {
                let blobData = new Blob(data, { type: 'video/mp4' }); 
                // Assign the url to the output video tag and anchor  
                const link = document.createElement("a")
                link.href = URL.createObjectURL(blobData)
                link.download = `video${Date.now()}.mp4`
                link.click();
            }
        } catch (error) {
            console.log(error);
        }
    }
}