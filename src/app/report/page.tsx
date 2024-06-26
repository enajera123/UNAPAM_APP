import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import InputField from '@/components/InputField/InputField';
import logoUNAPAM from '@/resources/LogoColorful.png';
import Image from 'next/image';
import { LuFileEdit } from 'react-icons/lu';

export default function Home() {
  return (
    <>
      <div className="max-w-4xl my-4 container mx-auto bg-gray-gradient p-10 flex flex-col justify-center items-center h-auto rounded-md">
        <p className="text-xl font-bold text-light-gray">Reportes de participantes</p>
        <div className="container bg-dark-gray p-5 justify-center items-center h-auto rounded-md">
          <div className="md:w-3/4 mb-4 mb-0 md:mr-4">
            <InputField
              label="Nombre del reporte"
              placeholder="NombreReporte"
              iconStart={<LuFileEdit color="white" />}
            />
          </div>
          <div className="flex grid grid-cols-4">
            <p className='col-span-3 flex items-center justify-center text-lg font-bold text-light-gray'>
              Nombre completo del participante
            </p>
            <div className="w-full">  
              <Button className="bg-red-gradient w-full">Participante</Button>
            </div>
          </div>
          <div className="w-full md:w-3/4 mb-4 md:mb-0 md:mr-4">
              <Checkbox label="Información personal del participante"/>
          </div><div className="w-full md:w-3/4 mb-4 md:mb-0 md:mr-4">
              <Checkbox label="Información de cursos del participante"/>
            </div><div className="w-full md:w-3/4 mb-4 md:mb-0 md:mr-4">
              <Checkbox label="Información de salud del participante"/>
            </div>
          <div className="md:w-3/4 mb-4 mb-0 md:mr-4">
            <Checkbox label="Requisitos pendientes"/>
          </div>
          <div className="w-full flex justify-center">
            <Button className="bg-red-gradient">Imprimir Reporte</Button>
          </div>
        </div>
        
      </div>
    </>
  );
}