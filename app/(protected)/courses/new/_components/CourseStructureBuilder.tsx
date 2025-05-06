"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Grip, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Volume, Module, Lesson, CourseStructure } from "@/lib/types/course";

interface CourseStructureBuilderProps {
  value: CourseStructure;
  onChange: (value: CourseStructure) => void;
}

export function CourseStructureBuilder({
  value = { volumes: [] },
  onChange,
}: CourseStructureBuilderProps) {
  const [expandedVolume, setExpandedVolume] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addVolume = () => {
    const newVolume: Volume = {
      id: generateId(),
      title: "New Volume",
      modules: [],
    };
    const updated = {
      ...value,
      volumes: [...(value.volumes || []), newVolume],
    };
    onChange(updated);
    setExpandedVolume(newVolume.id);
  };

  const addModule = (volumeId: string) => {
    const newModule: Module = {
      id: generateId(),
      title: "New Module",
      lessons: [],
    };
    const updated = {
      ...value,
      volumes: value.volumes.map((vol) =>
        vol.id === volumeId
          ? { ...vol, modules: [...(vol.modules || []), newModule] }
          : vol
      ),
    };
    onChange(updated);
    setExpandedModule(newModule.id);
  };

  const addLesson = (volumeId: string, moduleId: string) => {
    const newLesson: Lesson = { id: generateId(), title: "New Lesson" };
    const updated = {
      ...value,
      volumes: value.volumes.map((vol) =>
        vol.id === volumeId
          ? {
              ...vol,
              modules: vol.modules.map((mod) =>
                mod.id === moduleId
                  ? { ...mod, lessons: [...(mod.lessons || []), newLesson] }
                  : mod
              ),
            }
          : vol
      ),
    };
    onChange(updated);
  };

  const updateVolumeTitle = (volumeId: string, title: string) => {
    const updated = {
      ...value,
      volumes: value.volumes.map((vol) =>
        vol.id === volumeId ? { ...vol, title } : vol
      ),
    };
    onChange(updated);
  };

  const updateModuleTitle = (
    volumeId: string,
    moduleId: string,
    title: string
  ) => {
    const updated = {
      ...value,
      volumes: value.volumes.map((vol) =>
        vol.id === volumeId
          ? {
              ...vol,
              modules: vol.modules.map((mod) =>
                mod.id === moduleId ? { ...mod, title } : mod
              ),
            }
          : vol
      ),
    };
    onChange(updated);
  };

  const updateLessonTitle = (
    volumeId: string,
    moduleId: string,
    lessonId: string,
    title: string
  ) => {
    const updated = {
      ...value,
      volumes: value.volumes.map((vol) =>
        vol.id === volumeId
          ? {
              ...vol,
              modules: vol.modules.map((mod) =>
                mod.id === moduleId
                  ? {
                      ...mod,
                      lessons: mod.lessons.map((les) =>
                        les.id === lessonId ? { ...les, title } : les
                      ),
                    }
                  : mod
              ),
            }
          : vol
      ),
    };
    onChange(updated);
  };

  const removeVolume = (volumeId: string) => {
    const updated = {
      ...value,
      volumes: value.volumes.filter((vol) => vol.id !== volumeId),
    };
    onChange(updated);
  };

  const removeModule = (volumeId: string, moduleId: string) => {
    const updated = {
      ...value,
      volumes: value.volumes.map((vol) =>
        vol.id === volumeId
          ? {
              ...vol,
              modules: vol.modules.filter((mod) => mod.id !== moduleId),
            }
          : vol
      ),
    };
    onChange(updated);
  };

  const removeLesson = (
    volumeId: string,
    moduleId: string,
    lessonId: string
  ) => {
    const updated = {
      ...value,
      volumes: value.volumes.map((vol) =>
        vol.id === volumeId
          ? {
              ...vol,
              modules: vol.modules.map((mod) =>
                mod.id === moduleId
                  ? {
                      ...mod,
                      lessons: mod.lessons.filter((les) => les.id !== lessonId),
                    }
                  : mod
              ),
            }
          : vol
      ),
    };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={expandedVolume || undefined}
        onValueChange={(val) => setExpandedVolume(val || null)}
      >
        {value.volumes.map((volume) => (
          <AccordionItem key={volume.id} value={volume.id}>
            <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
              <div className="flex items-center gap-2">
                <Grip className="h-4 w-4 text-muted-foreground" />
                <span>{volume.title || "Untitled Volume"}</span>
                <span className="text-xs text-muted-foreground">
                  ({volume.modules.length} modules)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="space-y-4">
                <Input
                  placeholder="Volume Title"
                  value={volume.title}
                  onChange={(e) => updateVolumeTitle(volume.id, e.target.value)}
                />
                <Textarea
                  placeholder="Volume Description (optional)"
                  value={volume.description || ""}
                  onChange={(e) => updateVolumeTitle(volume.id, e.target.value)}
                  className="resize-y"
                />
                <div className="pl-6 space-y-2">
                  <div className="font-medium text-sm">Modules</div>
                  {volume.modules.map((module) => (
                    <Card key={module.id} className="border border-muted">
                      <CardHeader className="p-3 flex justify-between items-center">
                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            setExpandedModule(
                              expandedModule === module.id ? null : module.id
                            )
                          }
                        >
                          {expandedModule === module.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span>{module.title || "Untitled Module"}</span>
                          <span className="text-xs text-muted-foreground">
                            ({module.lessons.length} lessons)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeModule(volume.id, module.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      {expandedModule === module.id && (
                        <CardContent className="p-3 pt-0 space-y-4">
                          <Input
                            placeholder="Module Title"
                            value={module.title}
                            onChange={(e) =>
                              updateModuleTitle(
                                volume.id,
                                module.id,
                                e.target.value
                              )
                            }
                          />
                          <div className="space-y-2">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-2 border rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <Grip className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) =>
                                      updateLessonTitle(
                                        volume.id,
                                        module.id,
                                        lesson.id,
                                        e.target.value
                                      )
                                    }
                                    className="border-0 p-0 shadow-none focus-visible:ring-0"
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeLesson(
                                      volume.id,
                                      module.id,
                                      lesson.id
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => addLesson(volume.id, module.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Lesson
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => addModule(volume.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Module
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVolume(volume.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove Volume
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="outline" className="w-full" onClick={addVolume}>
        <Plus className="h-4 w-4 mr-2" /> Add Volume
      </Button>
      {value.volumes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="mb-2">No volumes added yet</div>
          <div className="text-sm">
            Start by adding a volume, then add modules and lessons to create
            your course structure.
          </div>
        </div>
      )}
    </div>
  );
}
