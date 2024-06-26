"use client";
import Button from "@/components/Button/Button";
import SearchBar from "@/components/SearchBar/SearchBar";
import Table from "@/components/Table/Table";
import { deleteParticipant } from "@/services/participantsService";
import {
  getParticipantOnCourseByCourseId,
  deleteParticipantOnCourse,
} from "@/services/participantOnCourseService";
import { generateRandomNumber } from "@/utils/numbers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Participant[]>([]);
  const [data, setData] = useState<Participant[]>([]);
  const [selectedOption, setSelectedOption] = useState("id");
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const router = useRouter();

  const fetchData = async () => {
    if (courseId) {
      const participants = await getParticipantOnCourseByCourseId(Number(courseId));
      console.log("Curso ID:", courseId);
      if (participants) {
        const transformedParticipants = participants.map((participant) => ({
          ...participant,
          hasWhatsApp: participant.hasWhatsApp === "Yes" ? "Si" : "No",
          policyExpirationDate: participant.Policy ? participant.Policy.expirationDate : "N/A",
          medicalReportExpirationDate: participant.MedicalReport ? participant.MedicalReport.expirationDate : "N/A",
        }));
        setData(transformedParticipants);
        setFilteredData(transformedParticipants);
        console.log("Partici: ", transformedParticipants);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      const valueToSearch =
        selectedOption === "id"
          ? item.identification
          : `${item.firstName} ${item.firstSurname} ${item.secondSurname}`;
      return valueToSearch.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredData(filtered);
    setRandomNumber(generateRandomNumber());
  };

  const handleDelete = async (id: number) => {
    try {
      deleteParticipantOnCourse(id, Number(courseId));
      setData(data.filter((participant) => participant.id !== id));
      setFilteredData(
        filteredData.filter((participant) => participant.id !== id)
      );
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };

  const updateParticipant = (id: number) => {
    router.push(`/record/${id}`);
  };

  return (
    <div className="container mx-auto bg-gray-gradient p-10 my-4 rounded-3xl flex flex-col items-center">
      <h1 className="text-white font-bold text-2xl mb-4 mt-0">
        Participantes de curso
      </h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        handleSearch={handleSearch}
        showSelect={true}
      />
      <div className="w-full">
        {filteredData.length > 0 ? (
          <Table
            keys={[
              "identification",
              "firstName",
              "firstSurname",
              "secondSurname",
              "policyExpirationDate",
              "medicalReportExpirationDate",
            ]}
            data={filteredData}
            headers={[
              "Identificación",
              "Nombre",
              "Primer Apellido",
              "Segundo Apellido",
              "Fec_Venc_Poliza",
              "Fec_Venc_Dictamen",
            ]}
            itemsPerPage={6}
            actionColumn="delete"
            resetPagination={randomNumber}
            deleteRowFunction={handleDelete}
            doubleClickRowFunction={updateParticipant}
            //addButtonUrl="/record"
          />
        ) : (
          <>
            <p className="text-center">No se encontraron resultados</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;