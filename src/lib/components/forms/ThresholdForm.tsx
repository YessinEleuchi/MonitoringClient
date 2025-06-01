import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";

export interface ThresholdFormData {
    critical_latency: number;
    critical_success_rate: number;
}

interface ThresholdFormProps {
    initialValues?: ThresholdFormData;
    onSubmit: (data: ThresholdFormData) => void;
    onClose: () => void;
}

export default function ThresholdForm({ initialValues, onSubmit, onClose }: ThresholdFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ThresholdFormData>({
        defaultValues: initialValues || { critical_latency: 0, critical_success_rate: 0 },
    });

    const submitHandler = (data: ThresholdFormData) => {
        // Ensure float values for backend compatibility
        const formattedData = {
            critical_latency: parseFloat(data.critical_latency.toString()),
            critical_success_rate: parseFloat(data.critical_success_rate.toString()),
        };
        onSubmit(formattedData);
        reset();
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
                <Label htmlFor="critical_latency">Latence critique (ms)</Label>
                <Input
                    id="critical_latency"
                    type="number"
                    step="0.01"
                    {...register("critical_latency", {
                        required: "La latence critique est requise",
                        valueAsNumber: true,
                        min: { value: 0, message: "La latence doit être positive" },
                    })}
                />
                {errors.critical_latency && <p className="text-red-500 text-sm">{errors.critical_latency.message}</p>}
            </div>

            <div>
                <Label htmlFor="critical_success_rate">Taux de succès critique (%)</Label>
                <Input
                    id="critical_success_rate"
                    type="number"
                    step="0.01"
                    {...register("critical_success_rate", {
                        required: "Le taux de succès critique est requis",
                        valueAsNumber: true,
                        min: { value: 0, message: "Le taux de succès doit être positif" },
                        max: { value: 100, message: "Le taux de succès ne peut pas dépasser 100%" },
                    })}
                />
                {errors.critical_success_rate && <p className="text-red-500 text-sm">{errors.critical_success_rate.message}</p>}
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Annuler
                </Button>
                <Button type="submit">
                    {initialValues ? "Mettre à jour" : "Créer"}
                </Button>
            </div>
        </form>
    );
}