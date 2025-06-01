import React, { useState, useEffect } from 'react';
import { Application, listApplications, createApplication, updateApplication, deleteApplication } from '@/services/applicationService';
import { Endpoint, listEndpoints, createEndpoint, updateEndpoint, deleteEndpoint } from '@/services/endpointService';
import { Thresholds, ThresholdsCreate, ThresholdsUpdate, createThresholds, updateThresholds, listThresholds } from '@/services/thresholdService';
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Button } from "@/lib/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import ApplicationForm, { ApplicationFormData } from '@/lib/components/forms/ApplicationForm';
import EndpointForm, { EndpointFormData } from '@/lib/components/forms/EndpointForm';
import ThresholdForm, { ThresholdFormData } from '@/lib/components/forms/ThresholdForm';

export default function Configuration() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [thresholds, setThresholds] = useState<Thresholds[]>([]);
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [isEndpointModalOpen, setIsEndpointModalOpen] = useState(false);
    const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);
    const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
    const [editingThreshold, setEditingThreshold] = useState<Thresholds | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [apps, ends, thresh] = await Promise.all([
                listApplications().then(res => res.data),
                listEndpoints().then(res => res.data),
                listThresholds().then(res => res.data)
            ]);
            setApplications(Array.isArray(apps) ? apps : [apps]);
            setEndpoints(Array.isArray(ends) ? ends : [ends]);
            setThresholds(Array.isArray(thresh) ? thresh : [thresh]);
        } catch (error) {
            console.error('Erreur de chargement:', error);
        }
    };

    const handleDeleteApplication = async (id: number) => {
        try {
            await deleteApplication(id);
            setApplications(applications.filter(app => app.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'application:', error);
        }
    };

    const handleDeleteEndpoint = async (id: number) => {
        try {
            await deleteEndpoint(id);
            setEndpoints(endpoints.filter(ep => ep.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'endpoint:', error);
        }
    };

    const handleCreateUpdateApplication = async (data: ApplicationFormData) => {
        try {
            if (editingApp) {
                await updateApplication(editingApp.id, data);
                setApplications(applications.map(app => app.id === editingApp.id ? { ...app, ...data } : app));
            } else {
                const response = await createApplication(data);
                setApplications([...applications, response.data]);
            }
            setIsAppModalOpen(false);
            setEditingApp(null);
        } catch (error) {
            console.error('Erreur lors de la création/mise à jour de l\'application:', error);
        }
    };

    const handleCreateUpdateEndpoint = async (data: EndpointFormData) => {
        try {
            if (editingEndpoint) {
                await updateEndpoint(editingEndpoint.id, data);
                setEndpoints(endpoints.map(ep => ep.id === editingEndpoint.id ? { ...ep, ...data } : ep));
            } else {
                const response = await createEndpoint(data);
                setEndpoints([...endpoints, response.data]);
            }
            setIsEndpointModalOpen(false);
            setEditingEndpoint(null);
        } catch (error) {
            console.error('Erreur lors de la création/mise à jour de l\'endpoint:', error);
        }
    };

    const handleCreateUpdateThreshold = async (data: ThresholdFormData) => {
        try {
            if (editingThreshold) {
                await updateThresholds(data);
                setThresholds(thresholds.map(th => th.id === editingThreshold.id ? { ...th, ...data } : th));
            } else {
                const response = await createThresholds(data);
                setThresholds([...thresholds, response.data]);
            }
            setIsThresholdModalOpen(false);
            setEditingThreshold(null);
        } catch (error) {
            console.error('Erreur lors de la création/mise à jour du seuil:', error);
        }
    };

    const openEditAppModal = (app: Application) => {
        setEditingApp(app);
        setIsAppModalOpen(true);
    };

    const openEditEndpointModal = (endpoint: Endpoint) => {
        setEditingEndpoint(endpoint);
        setIsEndpointModalOpen(true);
    };

    const openEditThresholdModal = (threshold: Thresholds) => {
        setEditingThreshold(threshold);
        setIsThresholdModalOpen(true);
    };

    const closeModal = (type: 'app' | 'endpoint' | 'threshold') => {
        if (type === 'app') {
            setIsAppModalOpen(false);
            setEditingApp(null);
        } else if (type === 'endpoint') {
            setIsEndpointModalOpen(false);
            setEditingEndpoint(null);
        } else {
            setIsThresholdModalOpen(false);
            setEditingThreshold(null);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Configuration</h1>

            <Tabs defaultValue="applications" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                    <TabsTrigger value="thresholds">Seuils & Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="applications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {applications.map(app => (
                                    <Card key={app.id}>
                                        <CardContent className="p-4">
                                            <h3 className="text-lg font-semibold">{app.name}</h3>
                                            <p className="text-sm text-gray-500">{app.base_url}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Button variant="outline" size="sm" onClick={() => openEditAppModal(app)}>Éditer</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteApplication(app.id)}>Supprimer</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button onClick={() => setIsAppModalOpen(true)}>Ajouter une application</Button>
                            </div>
                        </CardContent>
                    </Card>
                    {isAppModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold">{editingApp ? 'Éditer l\'application' : 'Nouvelle application'}</h2>
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => closeModal('app')}
                                        aria-label="Fermer"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <ApplicationForm
                                    initialData={editingApp}
                                    onSubmit={handleCreateUpdateApplication}
                                    submitLabel={editingApp ? 'Mettre à jour' : 'Créer'}
                                />
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="endpoints">
                    <Card>
                        <CardHeader>
                            <CardTitle>Endpoints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {endpoints.map(ep => (
                                    <Card key={ep.id}>
                                        <CardContent className="p-4">
                                            <h3 className="text-lg font-semibold">{ep.name || ep.url}</h3>
                                            <p className="text-sm text-gray-500">{ep.url}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Button variant="outline" size="sm" onClick={() => openEditEndpointModal(ep)}>Éditer</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteEndpoint(ep.id)}>Supprimer</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button onClick={() => setIsEndpointModalOpen(true)}>Ajouter un endpoint</Button>
                            </div>
                        </CardContent>
                    </Card>
                    {isEndpointModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold">{editingEndpoint ? 'Éditer l\'endpoint' : 'Nouvel endpoint'}</h2>
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => closeModal('endpoint')}
                                        aria-label="Fermer"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <EndpointForm
                                    initialValues={editingEndpoint}
                                    applications={applications}
                                    onSubmit={handleCreateUpdateEndpoint}
                                    submitLabel={editingEndpoint ? 'Mettre à jour' : 'Créer'}
                                />
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="thresholds">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seuils & Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {thresholds.map(th => (
                                    <Card key={th.id}>
                                        <CardContent className="p-4">
                                            <h3 className="text-lg font-semibold">
                                                Latence critique: {th.critical_latency}ms, Taux de succès: {th.critical_success_rate}%
                                            </h3>
                                            <div className="flex gap-2 mt-2">
                                                <Button variant="outline" size="sm" onClick={() => openEditThresholdModal(th)}>Éditer</Button>
                                                <Button variant="destructive" size="sm" disabled>Supprimer</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button onClick={() => setIsThresholdModalOpen(true)}>Ajouter un seuil</Button>
                            </div>
                        </CardContent>
                    </Card>
                    {isThresholdModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold">{editingThreshold ? 'Éditer le seuil' : 'Nouveau seuil'}</h2>
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => closeModal('threshold')}
                                        aria-label="Fermer"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <ThresholdForm
                                    initialValues={editingThreshold}
                                    onSubmit={handleCreateUpdateThreshold}
                                    onClose={() => closeModal('threshold')}
                                />
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}