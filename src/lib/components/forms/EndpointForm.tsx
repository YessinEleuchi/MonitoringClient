import { useForm, useFieldArray } from "react-hook-form";
import { Label } from "@/lib/components/ui/label";
import { Input } from "@/lib/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/lib/components/ui/select";
import { Application } from "@/services/applicationService";

interface ResponseCondition {
    field: string;
    condition: 'equals' | 'not_null' | 'contains';
    value?: string | number | boolean;
}

interface EndpointFormData {
    url: string;
    name?: string;
    description?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    use_auth: boolean;
    body_format?: 'json' | 'xml' | 'text';
    expected_status: number;
    response_format: 'json' | 'xml' | 'text';
    application_id: number;
    response_conditions?: ResponseCondition[];
    body?: string;
    headers?: string;
}

interface Props {
    onSubmit: (data: EndpointFormData) => void;
    initialValues?: EndpointFormData;
    applications: Application[];
    submitLabel?: string;
}

export default function EndpointForm({ onSubmit, initialValues, applications, submitLabel = "Enregistrer" }: Props) {
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<EndpointFormData>({
        defaultValues: initialValues || {
            method: "GET",
            use_auth: true,
            expected_status: 200,
            response_format: "json",
            body_format: "json",
            application_id: applications[0]?.id || 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "response_conditions",
    });

    const handleFormSubmit = (data: EndpointFormData) => {
        // Ensure URL starts with http:// or https://
        if (!data.url.match(/^https?:\/\//)) {
            data.url = `https://${data.url}`;
        }
        // Parse headers and body as JSON strings if provided
        if (data.headers) data.headers = JSON.stringify(JSON.parse(data.headers));
        if (data.body) data.body = JSON.stringify(JSON.parse(data.body));
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" {...register("name")} />
            </div>
            <div>
                <Label htmlFor="url">URL</Label>
                <Input
                    id="url"
                    {...register("url", {
                        required: "L'URL est requise",
                        pattern: {
                            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                            message: "Veuillez entrer une URL valide",
                        },
                    })}
                />
                {errors.url && <p className="text-red-500 text-sm">{errors.url.message}</p>}
            </div>
            <div>
                <Label htmlFor="application_id">Application</Label>
                <Select
                    value={String(watch("application_id"))}
                    onValueChange={(value) => setValue("application_id", parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir une application" />
                    </SelectTrigger>
                    <SelectContent>
                        {applications.map((app) => (
                            <SelectItem key={app.id} value={String(app.id)}>
                                {app.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.application_id && <p className="text-red-500 text-sm">Une application est requise</p>}
            </div>
            <div>
                <Label htmlFor="method">Méthode</Label>
                <Select value={watch("method")} onValueChange={(value) => setValue("method", value as any)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                        {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
                            <SelectItem key={method} value={method}>
                                {method}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="use_auth">Authentification</Label>
                <Select value={String(watch("use_auth"))} onValueChange={(val) => setValue("use_auth", val === "true")}>
                    <SelectTrigger>
                        <SelectValue placeholder="Utiliser l'authentification" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Oui</SelectItem>
                        <SelectItem value="false">Non</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="expected_status">Statut attendu</Label>
                <Input
                    id="expected_status"
                    type="number"
                    {...register("expected_status", { required: true, valueAsNumber: true, min: 100, max: 599 })}
                />
                {errors.expected_status && <p className="text-red-500 text-sm">Statut HTTP valide requis (100-599)</p>}
            </div>
            <div>
                <Label htmlFor="response_format">Format de réponse</Label>
                <Select
                    value={watch("response_format")}
                    onValueChange={(value) => setValue("response_format", value as any)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir un format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="text">Texte</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="body_format">Format du corps</Label>
                <Select
                    value={watch("body_format")}
                    onValueChange={(value) => setValue("body_format", value as any)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir un format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="text">Texte</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="body">Corps (JSON)</Label>
                <Input id="body" {...register("body")} placeholder='{"key": "value"}' />
                {errors.body && <p className="text-red-500 text-sm">Format JSON invalide</p>}
            </div>
            <div>
                <Label htmlFor="headers">En-têtes (JSON)</Label>
                <Input id="headers" {...register("headers")} placeholder='{"Content-Type": "application/json"}' />
                {errors.headers && <p className="text-red-500 text-sm">Format JSON invalide</p>}
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")} />
            </div>

        </form>
);
}