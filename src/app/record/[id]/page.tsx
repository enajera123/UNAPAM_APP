"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button/Button";
import InputField from "@/components/InputField/InputField";
import Select from "@/components/Select/Select";
import logoUNAPAM from "@/resources/LogoWhite.png";
import Image from "next/image";
import Table from "@/components/Table/Table";
import TableFile from "@/components/TableFile/TableFile";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineIdentification } from "react-icons/hi";
import Swal from "sweetalert2";
import Link from "next/link";
import { LuUserCircle2 } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { FiPhoneCall } from "react-icons/fi";
import { RiGraduationCapLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { useParticipantsStore } from "@/store/participantsStore";
import { usePolicyStore } from "@/store/policyStore";
import { useCourseStore } from "@/store/coursesStore";
import { useParticipantAttachmentStore } from "@/store/participantAttachmentStore";
import { useMedicalReportStore } from "@/store/medicalReportStore";
import { useParticipantOnCourseStore } from "@/store/participantOnCourseStore";
import { useRouter } from "next/navigation";
import { showDeleteConfirmation, showCustomAlert } from "@/utils/alerts";
import { getDownloadDocument } from "@/services/participantsService";

export default function ParticipantRegister({
  params,
}: {
  params: { id: string };
}) {
  const [identification, setIdentification] = useState("");
  const [name, setName] = useState("");
  const [firstSurname, setFirstSurname] = useState("");
  const [secondSurname, setSecondSurname] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("Sin_Estudio");
  const [date, setBirthDate] = useState("");
  const [typeID, setTypeID] = useState("Nacional");
  const [hasWhatsApp, setHasWhatsApp] = useState("Yes");
  const [expirationDatePolicy, setExpirationDatePolicy] = useState("");
  const [expirationDateReport, setExpirationDateReport] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState<File>();

  const { getParticipantById, putParticipant, deleteParticipant } =
    useParticipantsStore();
  const { postParticipantOnCourse } = useParticipantOnCourseStore();
  const { putPolicy } = usePolicyStore();
  const { putMedicalReport } = useMedicalReportStore();
  const { postParticipantAttachment, deleteParticipantAttachment } =
    useParticipantAttachmentStore();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [attachments, setAttachments] = useState<ParticipantAttachment | null>(
    null
  );
  const [participantAttachments, setParticipantAttachments] = useState([]);
  const [participants, setParticipants] = useState<ParticipantOnCourse[]>([]);
  const { getCourses, courses, getCourseById } = useCourseStore();
  const [filteredData, setFilteredData] = useState<Course[]>([]);
  const [dataFiles, setDataFiles] = useState([]);
  const router = useRouter();

  async function fetchParticipant() {
    const id = parseInt(params.id);
    if (!id) {
      console.error("No ID provided in params.");
      return;
    }
    console.log(`Fetching participant with ID: ${id}`);
    const response = await getParticipantById(id);
    console.log("Fetched participant data:", response);
    if (response) {
      setParticipant(response);
      if (response.ParticipantAttachments) {
        setAttachments(response.ParticipantAttachments);
      }
    } else {
      console.error(`Participant with ID ${id} not found.`);
    }
  }

  useEffect(() => {
    fetchParticipant();
  }, [params.id]);

  useEffect(() => {
    fetchDocuments();
  }, [attachments]);

  const fetchDocuments = async () => {
    if (attachments && attachments.length > 0) {
      try {
        const fileList = attachments.map((attachment) => {
          const mimeType = "application/octet-stream";
          const blob = new Blob([attachment.attachmentUrl], { type: mimeType });
          const file = new File([blob], attachment.name, { type: mimeType });

          return { name: attachment.name, url: URL.createObjectURL(file) };
        });
        setDataFiles(fileList);
      } catch (error) {
        console.error("Error loading documents:", error);
      }
    } else {
      console.error("No documents found in participant object.");
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (
        attachments &&
        attachments.attachmentUrl &&
        attachments.attachmentUrl.data
      ) {
        try {
          const buffer = attachments.attachmentUrl.data;
          const arrayBuffer = new Uint8Array(buffer).buffer;

          let mimeType = "";
          if (fileName.endsWith(".pdf")) {
            mimeType = "application/pdf";
          } else if (fileName.endsWith(".docx")) {
            mimeType =
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          } else if (fileName.endsWith(".doc")) {
            mimeType = "application/msword";
          } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            mimeType = "image/jpeg";
          } else if (fileName.endsWith(".png")) {
            mimeType = "image/png";
          } else {
            console.error("Tipo de archivo no admitido:", fileName);
            return;
          }

          const blob = new Blob([arrayBuffer], { type: mimeType });

          const file = new File([blob], fileName, { type: mimeType });

          setFileUrl(file);

          setDataFiles([{ name: fileName, url: URL.createObjectURL(file) }]);
        } catch (error) {
          console.error("Error al cargar los documentos:", error);
        }
      } else {
        console.error("No se encontraron documentos en el objeto participant.");
      }
    };

    fetchDocuments();
  }, [attachments]);

  /*useEffect(() => {
    if (participant && participant.ParticipantAttachments) {
      setParticipantAttachments(participant.ParticipantAttachments);
    }
  }, [participant]);*/

  useEffect(() => {
    const fetchPhoto = async () => {
      if (participant && participant.photo && participant.photo.data) {
        try {
          const buffer = participant.photo.data;
          const arrayBuffer = new Uint8Array(buffer).buffer;

          const blob = new Blob([arrayBuffer], { type: "image/jpeg" });

          const file = new File([blob], "photo.jpg", { type: blob.type });

          setPhotoFile(file);
        } catch (error) {
          console.error("Error al cargar la foto:", error);
        }
      } else {
        console.error(
          "No se encontraron datos de foto en el objeto participant."
        );
        console.error(
          "No se encontraron datos de foto en el objeto participant."
        );
      }
    };

    fetchPhoto();
  }, [participant]);

  useEffect(() => {
    console.log("Participant state updated:", participant);
    if (participant) {
      setIdentification(participant.identification);
      setPhoneNumber(participant.phoneNumber);
      setName(participant.firstName);
      setFirstSurname(participant.firstSurname);
      setSecondSurname(participant.secondSurname);
      setGrade(participant.grade.toString());
      setEmail(participant.email);
      setHasWhatsApp(participant.hasWhatsApp.toString());
      setTypeID(participant.typeIdentification.toString());
      setBirthDate(participant.birthDate);
      setExpirationDatePolicy(participant.Policy?.expirationDate);
      setExpirationDateReport(participant.MedicalReport?.expirationDate);
      setFileName(participant.ParticipantAttachments.name);
      if (participant.ParticipantAttachments) {
        setAttachments(participant.ParticipantAttachments);
      }
    }
  }, [participant]);

  const optionsGrade = [
    { value: "Sin_Estudio", label: "Sin estudio" },
    { value: "Primaria_Completa", label: "Primaria completa" },
    { value: "Primaria_Incompleta", label: "Primaria incompleta" },
    { value: "Secundaria_Completa", label: "Secundaria completa" },
    { value: "Secundaria_Incompleta", label: "Secundaria incompleta" },
    { value: "Universidad_Completa", label: "Universidad completa" },
    { value: "Universidad_Incompleta", label: "Universidad incompleta" },
  ];
  const optionsTypeIdentification = [
    { value: "Nacional", label: "Nacional" },
    { value: "DIMEX", label: "DIMEX" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      setPhotoFile(file);
    } else {
      console.error("Error: Archivo inválido seleccionado.");
      setPhotoFile(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const attachmentUrl = reader.result;
      setParticipantAttachments((prevAttachments) => [
        ...prevAttachments,
        { name: file.name, attachmentUrl },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateParticipant = async (e) => {
    e.preventDefault();

    const createParticipant = async (photoUrl = null) => {
      const participant = {
        identification,
        firstName: name,
        firstSurname,
        secondSurname,
        phoneNumber: phone,
        email,
        hasWhatsApp: hasWhatsApp as unknown as YesOrNo,
        grade: grade as unknown as Grade,
        birthDate: date,
        typeIdentification: typeID as unknown as TypeIdentification,
        photo: photoUrl,
      };

      try {
        const response = await putParticipant(Number(params.id), participant);
        console.log("updated participant", participant);
        if (response) {
          const participantId = response.id;

          if (expirationDatePolicy) {
            const policyData = {
              participantId,
              expirationDate: expirationDatePolicy,
            };
            await putPolicy(Number(params.id), policyData);
          }

          if (expirationDateReport) {
            const reportData = {
              participantId,
              expirationDate: expirationDateReport,
            };
            await putMedicalReport(Number(params.id), reportData);
          }

          if (participantAttachments.length > 0) {
            for (const attachment of participantAttachments) {
              const attachmentData = {
                participantId,
                name: attachment.name,
                attachmentUrl: Buffer.from(
                  attachment.attachmentUrl.split(",")[1],
                  "base64"
                ),
              };
              console.log("attachmentData", attachmentData);
              await postParticipantAttachment(attachmentData);
            }
          }

          router.push("/searches");
        }
      } catch (error) {
        console.error("Error al actualizar participante:", error);
      }
    };

    if (photoFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        await createParticipant(reader.result);
      };
      reader.readAsDataURL(photoFile);
    } else {
      await createParticipant();
    }
  };

  const handleDeleteParticipant = async (id: number) => {
    try {
      const result = await showDeleteConfirmation();
      if (result.isConfirmed) {
        await deleteParticipant(id);
        showCustomAlert(
          "¡Eliminado!",
          "El participante ha sido eliminado.",
          "success"
        );
        router.push("/searches");
      }
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };

  useEffect(() => {
    async function fetch() {
      await getCourses();
    }
    fetch();
  }, []);
  useEffect(() => {
    if (courses) {
      setFilteredData(courses);
    }
  }, [courses]);

  const addParticipantOnCourse = async (courseId: number) => {
    try {
      const participantId = parseInt(params.id);

      const participant = await getParticipantById(participantId);
      const course = await getCourseById(courseId);

      const newParticipantOnCourse = await postParticipantOnCourse({
        participantId,
        courseId,
        state: "Registered" as unknown as StateParticipantOnCourse,
        Participants: participant,
        Course: course,
      });
      if (newParticipantOnCourse) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Participante agregado al curso exitosamente.",
        });
        return;
      } else {
        console.error("Error al agregar participante en el curso.");
      }
    } catch (error) {
      console.error("Error al agregar participante en el curso:", error);
    }
  };

  const tableHeaders = ["Documento", "Link"];

  const combinedFiles = [
    ...dataFiles.map((file) => ({
      name: file.name,
      url: file.url,
    })),
    ...participantAttachments.map((attachment) => ({
      name: attachment.name,
      url: attachment.attachmentUrl,
    })),
  ];

  const tableData = combinedFiles.map((file) => ({
    Documento: file.name,
    Link: (
      <button
        className="flex items-center justify-center bg-white text-dark-gray rounded-xl px-2 border border-gray-400 shadow-md hover:bg-gray-100 hover:text-gray-800"
        onClick={() => {
          getDownloadDocument(params.id, file.name);
        }}
      >
        Ver Documento
      </button>
    ),
  }));
  console.log("descarga", dataFiles);

  const handleDeleteAttachment = async (id: number) => {
    try {
      await deleteParticipantAttachment(id);
      setParticipantAttachments((prevAttachments) =>
        prevAttachments.filter((attachment) => attachment.id !== id)
      );
    } catch (error) {
      console.error("Error deleting attachment", error);
    }
  };

  return (
    <div className="container mx-auto bg-gray-gradient p-10 h-auto max-w-4xl my-4 rounded-md gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <InputField
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
            label="Identificación"
            placeholder="Identificación"
            iconStart={<HiOutlineIdentification color="white" />}
          />
          <Select
            value={typeID}
            onChange={(e) => setTypeID(e.target.value)}
            label="Tipo de identificación"
            placeholder="Tipo de identificación"
            icon={<HiOutlineIdentification color="white" />}
            options={optionsTypeIdentification}
          />
        </div>
        <div className="col-span-1">
          <Select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            label="Escolaridad"
            placeholder="Escolaridad"
            icon={<RiGraduationCapLine color="white" />}
            options={optionsGrade}
          />
          <Select
            value={hasWhatsApp}
            onChange={(e) => setHasWhatsApp(e.target.value)}
            label="Tiene WhatsApp"
            placeholder="Tiene WhatsApp"
            icon={<FaWhatsapp color="white" />}
            options={[
              { value: "Yes", label: "Sí" },
              { value: "No", label: "No" },
            ]}
          />
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <Image src={logoUNAPAM} alt="logoUNAPAM" className="w-44 h-auto" />
        </div>
        <div className="col-span-1">
          <div className="mt-7">
            <label className="bg-red-gradient cursor-pointer text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Agregar Poliza Estudiantil
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className="mt-7">
            <label className="bg-red-gradient cursor-pointer text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Agregar Dictamen Médico
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
        <div className="col-span-1">
          <InputField
            value={expirationDatePolicy}
            onChange={(e) => setExpirationDatePolicy(e.target.value)}
            label="Vencimiento de Poliza"
            placeholder="Fecha de Vencimiento"
            type="date"
            iconStart={<FaRegCalendarAlt color="white" />}
          />
          <InputField
            value={expirationDateReport}
            onChange={(e) => setExpirationDateReport(e.target.value)}
            label="Vencimiento del Dictamen"
            placeholder="Fecha de Vencimiento"
            type="date"
            iconStart={<FaRegCalendarAlt color="white" />}
          />
        </div>
        <div className=""></div>
        <div className="col-span-1">
          <InputField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Nombre"
            placeholder="Nombre"
            iconStart={<GoPerson color="white" />}
          />
          <InputField
            value={phone}
            onChange={(e) => setPhoneNumber(e.target.value)}
            label="Telefono"
            placeholder="Telefono"
            iconStart={<FiPhoneCall color="white" />}
          />
        </div>
        <div className="col-span-1">
          <InputField
            value={firstSurname}
            onChange={(e) => setFirstSurname(e.target.value)}
            label="Primer Apellido"
            placeholder="Primer Apellido"
            iconStart={<GoPerson color="white" />}
          />
          <InputField
            value={date}
            onChange={(e) => setBirthDate(e.target.value)}
            label="Fecha de Nacimiento"
            placeholder="Fecha de Nacimiento"
            type="date"
            iconStart={<FaRegCalendarAlt color="white" />}
          />
        </div>
        <div className="col-span-1">
          <InputField
            value={secondSurname}
            onChange={(e) => setSecondSurname(e.target.value)}
            label="Segundo Apellido"
            placeholder="Segundo Apellido"
            iconStart={<GoPerson color="white" />}
          />
          <InputField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="Email"
            iconStart={<MdOutlineEmail color="white" />}
          />
        </div>
      </div>
      <div className="flex items-center justify-center ">
        <div>
          <div className="flex flex-col items-center justify-center">
            {photoFile ? (
              <img
                src={URL.createObjectURL(photoFile)}
                alt="Foto"
                className="w-32 h-auto"
              />
            ) : (
              <LuUserCircle2 className="w-32 h-auto text-white" />
            )}
            <label className="bg-red-gradient cursor-pointer text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
              Foto
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Link href={`/health?participantId=${params.id}`}>
          <Button className="bg-red-gradient w-52">Salud</Button>
        </Link>
        <Button
          onClick={(e) => handleUpdateParticipant(e)}
          className="bg-red-gradient w-1/3"
        >
          Registrar
        </Button>
        <Button
          onClick={() => handleDeleteParticipant(Number(params.id))}
          className="bg-red-gradient w-52"
        >
          Eliminar
        </Button>
      </div>
      <div className="container bg-white mt-6 p-4 rounded-xl">
        <p className="text-3xl font-bold text-dark-gray flex justify-center">
          Documentos Adjuntos
        </p>
        <div className="mt-6">
          <TableFile
            deleteFunction={handleDeleteAttachment}
            keys={["name", "url", "view"]}
            data={tableData}
            headers={tableHeaders}
            itemsPerPage={3}
          />
        </div>
        <div className="flex justify-center mt-6">
          <label className="bg-red-gradient cursor-pointer text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            Agregar
            <input
              type="file"
              accept=".pdf,.docx,.jpg,.png"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
      <div className="container bg-white mt-6 p-4 rounded-xl">
        <p className="text-3xl font-bold text-dark-gray flex justify-center">
          Cursos
        </p>
        <div className="mt-6">
          {filteredData.length > 0 ? (
            <Table
              desactivateRowFunction={addParticipantOnCourse}
              keys={["name", "courseNumber"]}
              data={filteredData}
              headers={["Nombre", "Código"]}
              itemsPerPage={3}
              actionColumn="add-participant"
            />
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </div>
      </div>
    </div>
  );
}
