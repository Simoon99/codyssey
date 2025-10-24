import { useCallback, useState } from "react";
import { getFirstMessage, getHelper, getStepTasks, getRequiredTasks } from "@/lib/journey-mapper";

export interface JourneyStepContext {
  orbId: string;
  helper: string;
  stepIndex: number;
  levelIndex: number;
  tasks: string[];
  requiredTasks: string[];
  firstMessage: string;
  cta: string;
}

export interface JourneyStepState extends JourneyStepContext {
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage journey step context and task loading
 */
export function useJourneyStep(initialContext?: JourneyStepContext) {
  const [state, setState] = useState<JourneyStepState>({
    orbId: initialContext?.orbId || "",
    helper: initialContext?.helper || "",
    stepIndex: initialContext?.stepIndex || 0,
    levelIndex: initialContext?.levelIndex || 0,
    tasks: initialContext?.tasks || [],
    requiredTasks: initialContext?.requiredTasks || [],
    firstMessage: initialContext?.firstMessage || "",
    cta: initialContext?.cta || "",
    isLoading: false,
    error: null,
  });

  /**
   * Set the journey step from orb selection
   */
  const setJourneyStep = useCallback((context: JourneyStepContext) => {
    setState({
      ...context,
      isLoading: false,
      error: null,
    });
  }, []);

  /**
   * Get tasks for current step
   */
  const getCurrentTasks = useCallback(() => {
    return state.tasks;
  }, [state.tasks]);

  /**
   * Get required tasks for current step
   */
  const getRequiredTasksList = useCallback(() => {
    return state.requiredTasks;
  }, [state.requiredTasks]);

  /**
   * Check if all required tasks are completed
   * (To be used with task progress from database)
   */
  const areAllRequiredTasksCompleted = useCallback(
    (completedTaskSlugs: string[]) => {
      return state.requiredTasks.every((taskSlug) =>
        completedTaskSlugs.includes(taskSlug)
      );
    },
    [state.requiredTasks]
  );

  /**
   * Clear journey step
   */
  const clearJourneyStep = useCallback(() => {
    setState({
      orbId: "",
      helper: "",
      stepIndex: 0,
      levelIndex: 0,
      tasks: [],
      requiredTasks: [],
      firstMessage: "",
      cta: "",
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    setJourneyStep,
    getCurrentTasks,
    getRequiredTasksList,
    areAllRequiredTasksCompleted,
    clearJourneyStep,
  };
}
