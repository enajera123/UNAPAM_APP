import axios from "axios";

export async function getParticipants() {
  try {
    const response = await axios.get("/api/participants");
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getDownloadDocument(id:string,name:string){
try{
  const response = await axios.get(`/api/participants/byDocument/${id}/${name}`,{responseType: 'blob'});
  const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name); 
    document.body.appendChild(link);
    link.click();
    link.remove();
  console.log("services",response.data)
  return response.data;
}
catch (error) {
  console.error(error);
  return null;
  }
} 


export async function getParticipantById(id: number) {
  try {
    const response = await axios.get(`/api/participants/${id}`);
    const participant = response.data;

    if (participant.ParticipantAttachments) {
      participant.ParticipantAttachments = participant.ParticipantAttachments.map(attachment => ({
        ...attachment,
        attachmentUrl: `data:application/octet-stream;base64,${attachment.attachmentUrl}`,
      }));
    }

    return participant;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createParticipant(participant: Participant) {
  try {
    const response = await axios.post<Participant>(
      "/api/participants",participant
    );
    console.log("service", participant);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateParticipant(id: number, participant: Participant) {
  try {
    const response = await axios.put(`/api/participants/${id}`, participant);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteParticipant(id: number) {
  try {
    const response = await axios.delete(`/api/participants/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getParticipantByEmail(email: string) {
  try {
    const response = await axios.get(`/api/participants/byEmail/${email}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getParticipantByFirstName(firstName: string) {
  try {
    const response = await axios.get(
      `/api/participants/byFirstName/${firstName}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getParticipantByIdentification(identification: string) {
  try {
    const response = await axios.get(
      `/api/participants/byIdentification/${identification}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
