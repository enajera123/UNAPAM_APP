import { create } from "zustand";
import { ParticipantOnCourseState } from "@/types/state";
import {
  getParticipantsOnCourse,
  getParticipantOnCourseByCourseId,
  createParticipantOnCourse,
  getParticipantOnCourseByParticipantId,
  deleteParticipantsOnCourseByCourseId
} from "@/services/participantOnCourseService";

export const useParticipantOnCourseStore = create<ParticipantOnCourseState>(
  (set) => ({
    participantsOnCourse: [] as ParticipantOnCourse[],
    setParticipantsOnCourse: (participantsOnCourse) =>
      set({ participantsOnCourse }),

    getParticipantsOnCourse: async () => {
      const participantsOnCourse = await getParticipantsOnCourse();
      set({ participantsOnCourse });
    },

    getParticipantOnCourseByCourseId: async (id: number) => {
      const participantOnCourse = await getParticipantOnCourseByCourseId(id);
      set((state) => ({
        participantsOnCourse: state.participantsOnCourse.map((p) =>
          p.courseId === id ? participantOnCourse : p
        ),
      }));
    },

    postParticipantOnCourse: async (
      participantOnCourse: ParticipantOnCourse
    ) => {
      try {
        const newParticipantOnCourse = await createParticipantOnCourse(
          participantOnCourse
        );
        if (newParticipantOnCourse) {
          set((state) => ({
            participantsOnCourse: [
              ...state.participantsOnCourse,
              newParticipantOnCourse,
            ],
          }));
          return newParticipantOnCourse;
        }
        return null;
      } catch (error) {
        console.error("Error al crear el participante en el curso:", error);
        return null;
      }
    },

    getParticipantOnCourseByParticipantId: async (participantId: number) => {
      const participantOnCourse = await getParticipantOnCourseByParticipantId(
        participantId
      );
      set((state) => ({
        participantsOnCourse: state.participantsOnCourse.map((p) =>
          p.participantId === participantId ? participantOnCourse : p
        ),
      }));
    },

    deleteParticipantsOnCourseByCourseId: async (courseId: number) => {
      await deleteParticipantsOnCourseByCourseId(courseId);
      set((state) => ({
        participantsOnCourse: state.participantsOnCourse.filter(
          (p) => p.courseId !== courseId
        ),
      }));
    },
  })
);
