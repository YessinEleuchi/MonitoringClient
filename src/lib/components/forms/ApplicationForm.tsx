import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import { useForm } from "react-hook-form";

export interface ApplicationFormData {
    name?: string;
    base_url: string;
    status: 'active' | 'inactive' | 'maintenance';
    description?: string;
    auth_type?: 'none' | 'basic' | 'jwt';
    auth_url?: string;
    auth_credentials?: string; // JSON string representing Dict[str, str]
}

interface Props {
    initialData?: ApplicationFormData;
    onSubmit: (data: ApplicationFormData) => void;
    submitLabel?: string;
}

export default function ApplicationForm({ initialData, onSubmit, submitLabel = "Valider" }: Props) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ApplicationFormData>({
        defaultValues: initialData || {
            name: '',
            base_url: '',
            status: 'active',
            auth_type: 'none',
            description: '',
            auth_url: '',
            auth_credentials: '',
        },
    });

    const handleFormSubmit = (data: ApplicationFormData) => {
        // Ensure URLs start with http:// or https://
        if (data.base_url && !data.base_url.match(/^https?:\/\//)) {
            data.base_url = `https://${data.base_url}`;
        }
        if (data.auth_url && !data.auth_url.match(/^https?:\/\//)) {
            data.auth_url = `https://${data.auth_url}`;
        }
        // Validate and parse auth_credentials as JSON
        if (data.auth_credentials) {
            try {
                JSON.parse(data.auth_credentials);
            } catch {
                alert("Les identifiants d'authentification doivent être au format JSON valide.");
                return;
            }
        }
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" {...register('name')} />
            </div>
            <div>
                <Label htmlFor="base_url">URL de base</Label>
                <Input
                    id="base_url"
                    {...register('base_url', {
                        required: "L'URL de base est requise",
                        pattern: {
                            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                            message: "Veuillez entrer une URL valide",
                        },
                    })}
                />
                {errors.base_url && <p className="text-red-500 text-sm">{errors.base_url.message}</p>}
            </div>
            <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={watch('status')} onValueChange={(val) => setValue('status', val as any)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="auth_type">Type d'authentification</Label>
                <Select value={watch('auth_type')} onValueChange={(val) => setValue('auth_type', val as any)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="jwt">JWT</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register('description')} />
            </div>
            <div>
                <Label htmlFor="auth_url">URL d'authentification</Label>
                <Input
                    id="auth_url"
                    {...register('auth_url', {
                        pattern: {
                            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                            message: "Veuillez entrer une URL valide",
                        },
                    })}
                />
                {errors.auth_url && <p className="text-red-500 text-sm">{errors.auth_url.message}</p>}
            </div>
            <div>
                <Label htmlFor="auth_credentials">Identifiants d'authentification (JSON)</Label>
                <Input
                    id="auth_credentials"
                    {...register('auth_credentials')}
                    placeholder='{"username": "user", "password": "pass"}'
                />
            </div>
            <Button type="submit">{submitLabel}</Button>
        </form>
    );
}