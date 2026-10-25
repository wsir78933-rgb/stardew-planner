import type { CalculateProcessingRoutesInput, ProcessingMachine } from "../processing-tools/processing-model";
import { readProductionPlanInput, type ProductionPlanInput } from "../production-tools/production-model";
import type { KegCapacityPlanHandoff } from "../workshop-tools/keg-capacity";

function selectProductionMachineCounts(
  machineCounts: CalculateProcessingRoutesInput["machineCounts"],
  selectedMachine: ProcessingMachine | "all",
): CalculateProcessingRoutesInput["machineCounts"] {
  if (selectedMachine === "all") return machineCounts;
  if (selectedMachine !== "keg" && selectedMachine !== "jar" && selectedMachine !== "dehydrator") {
    throw new Error(`Unsupported production machine selection. Received: ${JSON.stringify(selectedMachine)}.`);
  }
  return {
    keg: selectedMachine === "keg" ? machineCounts.keg : 0,
    jar: selectedMachine === "jar" ? machineCounts.jar : 0,
    dehydrator: selectedMachine === "dehydrator" ? machineCounts.dehydrator : 0,
  };
}

export function createProcessingProductionPlan(
  input: CalculateProcessingRoutesInput,
  selectedMachine: ProcessingMachine | "all" = "all",
): ProductionPlanInput {
  return readProductionPlanInput({
    inventory: [{ id: "processing-stock", ingredientId: input.ingredientId, quality: input.quality, quantity: input.quantity, reservedQuantity: 0, availableDay: 0, hasBearsKnowledge: input.hasBearsKnowledge, coconutSource: input.coconutSource }],
    machineCounts: selectProductionMachineCounts(input.machineCounts, selectedMachine),
    profession: input.profession,
    deadlineDays: input.deadlineDays,
  });
}

/** The workshop's test action plans the current stack; repeated harvests are not yet owned inventory. */
export function createKegCapacityProductionPlan(handoff: KegCapacityPlanHandoff): ProductionPlanInput {
  return createProcessingProductionPlan({
    ingredientId: handoff.ingredientId,
    quantity: handoff.quantity,
    quality: handoff.quality,
    profession: handoff.profession,
    machineCounts: handoff.machineCounts,
    deadlineDays: handoff.deadlineDays,
    mode: "capacity",
  });
}
