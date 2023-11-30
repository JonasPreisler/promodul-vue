<template>
  <Layout>
<div>



  <div class="gstc-wrapper" ref="gstc"></div>
</div>

 <b-modal v-model="projectModal"  hide-footer size="lg" :title="$t('common.Create new project')" @hidden="resetModal()">
   <form action="#" @submit.prevent="addProjectForm">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                       <h5> <span v-html="alertText"></span> </h5>       
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>{{$t("common.name")}}</label>  
                        <input v-model="projectForm.title" type="text" class="form-control" :placeholder="$t('common.Project name')" name="title"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.title.$error}" />
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t("common.Start date")}}</label>  
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="projectForm.start_date" @change="getUserResourceList"   append-to-body lang="nb" 
                          
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t("common.Deadline")}}</label>
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="projectForm.deadline" @change="getUserResourceList"  append-to-body lang="nb" 
                         
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                                        <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add employee")}}</label>  
                        <div class="col-lg-12">
                             <multiselect 
                                
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="userValue" 
                                :options="addProjectUsersList"
                                :multiple="true"
                                track-by="first_name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelUser"
                                :close-on-select="false"
                                @select=onSelectUser($event)
                                @remove=onRemoveUsers($event)
                                >
                                <span slot="noOptions">{{$t("common.Not an available employee for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"   @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.first_name }} {{ scope.option.last_name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                              </multiselect>
                           
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                      <label>{{$t("common.Add machine")}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="machineValue" 
                                :options="addProjectMachinesList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onSelectMachine($event)
                                @remove=onRemoveMachine($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available machine for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                            
                        </div>
                      </div>
                    </div>
                     <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add tool")}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="toolValue" 
                                :options="addProjectToolsList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onSelectTool($event)
                                @remove=onRemoveTool($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available tool for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"   v-model="scope.option.checked" @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>

                            
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add external resource")}}</label>
                        <div class="col-lg-12">
                            <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="resoourceValue" 
                                :options="addProjectExternalResourceList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onSelectExternalResource($event)
                                @remove=onRemoveExternalResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available resource for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add contact pesron")}}</label>  
                        <input v-model="projectForm.contact_person" type="text" class="form-control" :placeholder="$t('common.Contact person')" name="contact_person"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.contact_person.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add post number")}}</label>  
                        <input v-model="projectForm.post_number" type="text" class="form-control" :placeholder="$t('common.Post number')" name="post_number"
                        />
                    </div>                   
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Address")}}</label>  
                        <input v-model="projectForm.address" type="text" class="form-control" :placeholder="$t('common.Address')" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t("common.description")}}</label>  
                        <textarea v-model="projectForm.description" type="text" class="form-control" rows="3" :placeholder="$t('common.description')" name="description"
                        ></textarea>
                    </div> 
                    <div class="col-md-12 mt-3">
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> {{$t("common.Save")}}</button>
                    </div>
                </div>
   </form>     
</b-modal>

 <b-modal v-model="editProjectModal"  hide-footer size="lg" :title="$t('common.Edit project')" @hidden="resetEditModal()">
   <form action="#" @submit.prevent="SubmitEditProject">
                <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showAddAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                        <label>{{$t("common.name")}}</label>  
                        <input v-model="editProjectForm.title" type="text" class="form-control" :placeholder="$t('common.Project name')" name="title" />
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t("common.Start date")}}</label>  
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editProjectForm.start_date" @change="getUserResourceList"   append-to-body lang="nb"
                          ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t("common.Deadline")}}</label>
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editProjectForm.deadline" @change="getUserResourceList"  append-to-body lang="nb" ></date-picker>
                        </div>
                      </div>
                    </div>
                                        <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add employee")}}</label>  
                        <div class="col-lg-12">
                             <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editUserValue" 
                                :options="addProjectUsersList"
                                :multiple="true"
                                track-by="first_name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelUser"
                                :close-on-select="false"
                                @select=onAddUser($event)
                                @remove=onDeleteUsers($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available employee for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"   @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.first_name }} {{ scope.option.last_name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                              </multiselect>
                           
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                      <label>{{$t("common.Add machine")}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editMachineValue" 
                                :options="addProjectMachinesList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available machine for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                            
                        </div>
                      </div>
                    </div>
                     <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add tool")}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editToolValue" 
                                :options="addProjectToolsList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available tool for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"   v-model="scope.option.checked" @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>

                            
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add external resource")}}</label>
                        <div class="col-lg-12">
                            <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editResoourceValue" 
                                :options="addProjectExternalResourceList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available resource for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add contact pesron")}}</label>  
                        <input v-model="editProjectForm.contact_person" type="text" class="form-control" :placeholder="$t('common.Contact person')" name="contact_person"
                        :class="{'is-invalid': projectSubmit && $v.projectForm.contact_person.$error}" />
                    </div>
                    <div class="col-md-6 pt-3">
                      <label>{{$t("common.Add post number")}}</label>  
                        <input v-model="editProjectForm.post_number" type="text" class="form-control" :placeholder="$t('common.Post number')" name="post_number"
                        />
                    </div>                   
                    <div class="col-md-6 pt-3">
                      <label>{{$t('common.Address')}}</label>  
                        <input v-model="editProjectForm.address" type="text" class="form-control" :placeholder="$t('common.Address')" name="address"
                />
                    </div>
                     <div class="col-md-12 pt-3">
                       <label>{{$t('common.description')}}</label>  
                        <textarea v-model="editProjectForm.description" type="text" class="form-control" rows="3" :placeholder="$t('common.desciption')" name="description"
                        ></textarea>
                    </div> 
                    <div class="col-md-12 mt-3">
                      <button type="submit" class="btn btn-primary">  <i class="bx bx-save"></i> {{$t('common.Save')}}</button>
                    </div>
                </div>
   </form>     
</b-modal>

<b-modal  title="Edit Task" size="xl" v-model="editTaskModal" hide-footer>
               <form action="#" @submit.prevent="submitEditTaskForm" href="">
                 <div class="row">
                    <div class="col-md-12">
                       <b-alert v-model="showEditAlert" dismissible variant="danger">
                      <h5>{{alertText}}</h5>         
                         </b-alert>    
                    </div>
               
                    <div class="col-md-6">
                      <div class="form-group row">
                         <label>{{$t("common.Task title")}}</label>
                         <div class="col-ld-12">
                        <input v-model="editTaskForm.title" type="text" class="form-control" :placeholder="$t('common.Enter title')" name="title"
                         />
                      </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                        <label>{{$t('common.Start date')}}</label>  
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editTaskForm.start_time"  append-to-body lang="nb" ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-group row">
                       <label>{{$t('common.Deadline')}}</label>
                        <div class="col-lg-12">
                          <date-picker :formatter="myFormat"  v-model="editTaskForm.deadline"  append-to-body lang="nb" ></date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add employee")}}</label>  
                        <div class="col-lg-12">
                             <multiselect 
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editUserValue" 
                                :options="taskUsersList"
                                :multiple="true"
                                track-by="first_name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelUser"
                                :close-on-select="false"
                                @select=onAddUser($event)
                                @remove=onDeleteUsers($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available employee for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"   @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.first_name }} {{ scope.option.last_name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                              </multiselect>
                           
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                      <label>{{$t("common.Add machine")}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                          
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editMachineValue" 
                                :options="taskMachinesList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available Machine for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                            
                        </div>
                      </div>
                    </div>
                     <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add tool")}}</label>  
                        <div class="col-lg-12">
                          <multiselect 
                          
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editToolValue" 
                                :options="taskToolsList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available tool for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"   v-model="scope.option.checked" @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>

                            
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mt-3">
                      <div class="form-group row">
                        <label>{{$t("common.Add external resource")}}</label>
                        <div class="col-lg-12">
                            <multiselect 
                            
                                select-label="klikk enter for å velge"
                                selected-label="valgt"
                                deselect-label="klikk enter for å fjerne"
                                v-model="editResoourceValue" 
                                :options="taskExternalResourceList"
                                :multiple="true"
                                track-by="name"
                                :placeholder="$t('common.Select option')"
                                :custom-label="customLabelMachine"
                                :close-on-select="false"
                                @select=onAddResource($event)
                                @remove=onDeleteResource($event)
                                >
                                  <span slot="noOptions">{{$t("common.Not an available resource for this date")}}</span>
                                <span class="checkbox-label" slot="option" slot-scope="scope" @click.self="select(scope.option)">
                                  <input class="test me-1" type="checkbox"  v-model="scope.option.checked"  @focus.prevent/>
                                  <span class="font-size-14 text-black">{{ scope.option.name }}</span> 
                                  <div class="mt-0"></div>
                                  <br > <span  class="ms-3">{{$t("common.Avialable dates")}}: </span> 
                                  <div class="mt-2"></div>
                                  <div class="ms-3 text-start text-success"  v-for="dates in scope.option.available_dates" :key="dates">
                                    {{ format_date_m(dates.first)}} - {{ format_date_m(dates.last)}}
                                  </div>
                                  <hr class="m-0 p-0 mt-1">
                                </span>
                          </multiselect>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12 mt-3">
                      <div class="form-group row">
                        <label>{{$t('common.description')}}</label>
                        <div class="col-lg-12">
                          <textarea v-model="editTaskForm.description" rows="3" class="form-control"></textarea>    
                        </div>
                      </div>
                    </div>
     
                  
                    <div class="col-md-12 mt-3 text-end">
                      <b-button type="submit" variant="outline-success">  <i class="bx bx-save"></i> {{$t('common.Save')}}</b-button>
                    </div>
                </div>
            </form>   
     
</b-modal>


  </Layout>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import Multiselect from "vue-multiselect";
import 'vue2-datepicker/locale/nb';

import GSTC from 'gantt-schedule-timeline-calendar';
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
import 'gantt-schedule-timeline-calendar/dist/style.css';
import axios from "axios";
import ApiService from "@/state/modules/api.service";
import moment from "moment";
import Layout from "../../layouts/main";
import { tippy } from "vue-tippy";
import {
  required,

} from "vuelidate/lib/validators";



     
    

let gstc, state;

// helper functions
/**
 * @returns { import("gantt-schedule-timeline-calendar").Rows }
 */

/**
 * @returns { import("gantt-schedule-timeline-calendar").Items }
 */






// main component
export default {
    components: {
    DatePicker,  
    Layout,
    Multiselect
  },
  name: 'GSTC',
   data() {
    return {
      myFormat: {
       // Date to String
        stringify: (date) => {
          return date ? moment(date).format('DD.MM.YYYY') : null
        },
        // String to Date
        parse: (value) => {
          return value ? moment(value, 'DD.MM.YYYY').toDate() : null
        }
      },
     projectId: 0,
    
    
      projectModal: false,
      showAddAlert:false,
      alertText: null,
      projectSubmit:false,
      addProjectUsersList:[],
      addProjectExternalResourceList:[],
      addProjectMachinesList:[],
      addProjectToolsList:[],
      userValue:null,
      machineValue: null,
      toolValue:null,
      resoourceValue: null,
      editUserValue:null,
      editMachineValue: null,
      editToolValue:null,
      editResoourceValue: null,
      editProjectModal: false,
      project_id:0,
      addDeleteUserList: [],
      addDeleteResourceList:[],
      projectdata: [],
      taskData:[],
       editTaskModal:false,
     
       showEditAlert: false,
       taskUsersList: [],
       taskExternalResourceList: [],
       taskMachinesList:[],
       taskToolsList: [],
      projectForm: {
        user_account_projects_attributes:[],
        project_resources_attributes:[],
        title: null,
        description: null,
        address: null,
        post_number: null,
        contact_person: null,
        start_date: null,
        deadline: null
      },
      editProjectForm: {
        user_account_projects_attributes:[],
        project_resources_attributes:[],
        id: 0,
        title: null,
        description: null,
        address: null,
        post_number: null,
        contact_person: null,
        start_date: null,
        deadline: null
      },
      editTaskForm: {
        project_id:0,
        id:0,
        title:null,
        description: null,
        start_time: null,
        deadline: null,
        user_account_tasks_attributes: [],
        task_resources_attributes: []
      },
      title: []
      }
      },
       validations: {
         projectForm: {
           title: { required },
           contact_person: { required },
   
         },

  },
  beforeUnmount() {
        if (gstc) gstc.destroy();
        },
  methods:{
        // eslint-disable-next-line no-unused-vars
    formSubmit(e) {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
    },
        tooltipForm() {
      this.submitform = true;
      this.$v.$touch();
    },
    addProjectForm() {
        // eslint-disable-next-line no-console
        
       this.showAddAlert = false;
       this.alertText = null
       this.projectSubmit = true;
      if (this.userValue == null) {
        this.projectSubmit = false 
        this.showAddAlert = true;
        this.alertText = "Employee coun't be Emp"

      }
      
      this.$v.$touch();
     
          if (!this.$v.$invalid) {
        
           this.projectForm.start_date = this.format_date(this.projectForm.start_date)
            this.projectForm.deadline = this.format_date(this.projectForm.deadline)
          if(this.projectId ==0) {

            this.projectForm.user_account_projects_attributes = [];
            this.projectForm.project_resources_attributes = [];

          this.userValue.forEach(element => {
            this.projectForm.user_account_projects_attributes.push({"user_account_id":element.id})
          });
          if(this.machineValue) {
           this.machineValue.forEach(element => {
            this.projectForm.project_resources_attributes.push({"resource_id":element.id})
          });
          }
          if(this.toolValue) {
              this.toolValue.forEach(element => {
              this.projectForm.project_resources_attributes.push({"resource_id":element.id})
            });
          }
          if (this.resoourceValue) {
            this.resoourceValue.forEach(element => {
            this.projectForm.project_resources_attributes.push({"resource_id":element.id})
          });
          }
            // eslint-disable-next-line no-unused-vars
            ApiService.post("/projects", this.projectForm).then(response => {
            // eslint-disable-next-line no-console

          // this.projects.push(response.data.project)
           
            this.projectModal = false;
                 if (gstc) gstc.update();
             //   this.refreshEvents()
          },
          error =>{
            this.showAddAlert = true;
               let err_text= ""
            error.response.data.errors.map(function(value,key){
              err_text =err_text+ (key+1)+"."+value["message"]+". &nbsp;&nbsp;&nbsp;"
            })
            this.alertText = err_text
     
          }
          )
               } else if (this.projectId > 0) {
               const form  = new FormData();
               form.append("id",this.projectId);
               form.append("title",  this.projectForm.title)
               form.append('description',  this.projectForm.description)
               form.append("address",  this.projectForm.address)
               form.append("post_number",  this.projectForm.post_number)
               form.append("contact_person",  this.projectForm.contact_person)
               form.append("start_date",  this.projectForm.start_date)
               form.append("deadline",  this.projectForm.deadline)


                 ApiService.put("/projects", form).then(() => {
            // eslint-disable-next-line no-console
             this.get_project_list();         
            this.projectModal = false;
            this.projectId = 0;
          
          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0].message
             
          }
          )}
               }
           
    },
    SubmitEditProject() {

    
        this.editProjectForm.user_account_projects_attributes = this.addDeleteUserList
        this.editProjectForm.project_resources_attributes = this.addDeleteResourceList 

          this.editProjectForm.start_date = this.format_date(this.editProjectForm.start_date)
          this.editProjectForm.deadline = this.format_date(this.editProjectForm.deadline)
  
          // eslint-disable-next-line no-console
         

            ApiService.put("/projects", this.editProjectForm).then(() => {
         
            this.editProjectModal = false;
          

          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0]["message"]
            // eslint-disable-next-line no-console
          
          }
          )
       
    },
    customLabelUser (option) {
      return ` ${option.first_name} ${option.last_name}`
    },
    customLabelMachine (option) {
      return ` ${option.name}`
    },
     onSelectUser (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.addProjectUsersList.findIndex(item => item.id==option.id);
      this.addProjectUsersList[index].checked = true;
            // eslint-disable-next-line no-console
    },
    onSelectMachine (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.addProjectMachinesList.findIndex(item => item.id==option.id);
      this.addProjectMachinesList[index].checked = true;
            // eslint-disable-next-line no-console
    },
    onSelectTool (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.addProjectToolsList.findIndex(item => item.id==option.id);
      this.addProjectToolsList[index].checked = true;
            // eslint-disable-next-line no-console
    },
    onSelectExternalResource (option) {
      // eslint-disable-next-line no-unused-vars
      let index = this.addProjectExternalResourceList.findIndex(item => item.id==option.id);
      this.addProjectExternalResourceList[index].checked = true;
            // eslint-disable-next-line no-console
    },   
    onRemoveUsers (option) {
      let index = this.addProjectUsersList.findIndex(item => item.library==option.library);
      this.addProjectUsersList[index].checked = false;

    },
    onRemoveMachine (option) {
      let index = this.addProjectMachinesList.findIndex(item => item.library==option.library);
      this.addProjectMachinesList[index].checked = false;

    },
    onRemoveTool (option) {
      let index = this.addProjectToolsList.findIndex(item => item.library==option.library);
      this.addProjectToolsList[index].checked = false;

    },
    onRemoveExternalResource (option) {
      let index = this.addProjectExternalResourceList.findIndex(item => item.library==option.library);
      this.addProjectExternalResourceList[index].checked = false;

    },
       onAddUser(option){
      
      this.addDeleteUserList.push({
      user_account_id:option.id
      })
    },
    onDeleteUsers(option) {
      this.addDeleteUserList.push({
         id: option.project_user_id,
         user_account_id: option.id,
         _destroy: true
      })
    },
    onAddResource(option){
      
      this.addDeleteResourceList.push({
      resource_id:option.id
      })
    },
    onDeleteResource(option) {
      this.addDeleteResourceList.push({
         id: option.project_resource_id,
         resource_id: option.id,
         _destroy: true
      })
    },
    onCellClick(row, time) {
     this.projectForm.start_date = new Date(time.leftGlobalDate.format('YYYY-MM-DD'))  
      this.projectForm.deadline = new Date(time.leftGlobalDate.format('YYYY-MM-DD'))
      // eslint-disable-next-line no-console
          this.projectModal = true
          this.getUserResourceList()

},
    getUserResourceList() {
      ApiService.get("/resources/task_resource_list?start_date="+this.format_date(this.projectForm.start_date)+"&deadline="+this.format_date(this.projectForm.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.addProjectExternalResourceList = response.data.resources.external_resources
          this.addProjectMachinesList = response.data.resources.machines
          this.addProjectToolsList = response.data.resources.tools
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
      ApiService.get("users/task_user_list?start_date="+this.format_date(this.projectForm.start_date)+"&deadline="+this.format_date(this.projectForm.deadline)).then(
      response => {
           // eslint-disable-next-line no-console
          this.addProjectUsersList = response.data.employees
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
 
    },
 onCellCreate1({ time, row, vido }) {
  return vido.html`<div class="my-grid-cell" @click=${() =>
    this.onCellClick(
      row,
      time
    )} style="cursor:pointer;width:100%;height:100%;"></div>`;
},
  submitEditTaskForm() {
        
      
        this.editTaskForm.user_account_tasks_attributes = this.addDeleteUserList
        this.editTaskForm.task_resources_attributes = this.addDeleteResourceList 

          this.editTaskForm.start_time = this.format_date(this.editTaskForm.start_time)
          this.editTaskForm.deadline = this.format_date(this.editTaskForm.deadline)
            this.editTaskForm.project_id = this.project_id
          // eslint-disable-next-line no-console
         

            ApiService.put("/tasks", this.editTaskForm).then(()=> {
           

            this.editTaskModal = false;

          },
          error =>{
            this.showAddAlert = true;
            this.alertText = error.response.data.errors[0]["message"]
            // eslint-disable-next-line no-console
          
          }
          )
       
    },
editProjectTask(id,type){
  // eslint-disable-next-line no-console
  
 if (type == "Task") {
  ApiService.get("/tasks/"+id).then(
      response => {
        // eslint-disable-next-line no-console
           this.editUserValue = response.data.task.users
           this.editMachineValue = response.data.task.resources.models
           this.editToolValue = response.data.task.resources.tools
           this.editResoourceValue = response.data.task.resources.resources
           this.project_id = response.data.task.project_id
           
          this.editTaskForm.id = response.data.task.id
          this.editTaskForm.title = response.data.task.title
          this.editTaskForm.start_time = new Date(response.data.task.start_time)
          this.editTaskForm.deadline = new Date(response.data.task.deadline)
          this.editTaskForm.description = response.data.task.description

          ApiService.get("/resources/task_resource_list?start_date="+moment(String(response.data.task.start_time)).format("YYYY-MM-DD")+"&deadline="+moment(String(response.data.task.deadline)).format("YYYY-MM-DD")).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskExternalResourceList = response.data.resources.external_resources
          this.taskMachinesList = response.data.resources.machines
          this.taskToolsList = response.data.resources.tools
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
          ApiService.get("users/task_user_list?start_date="+moment(String(response.data.task.start_time)).format("YYYY-MM-DD")+"&deadline="+moment(String(response.data.task.deadline)).format("YYYY-MM-DD")).then(
      response => {
           // eslint-disable-next-line no-console
          this.taskUsersList = response.data.employees
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
   
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );
  
     this.editTaskModal = true
      

 }

  if (type == "Project") {
      
        ApiService.get("/projects/get_project/"+id).then(
      response => {
        // eslint-disable-next-line no-console

        this.editUserValue = response.data.project.users
        this.editResoourceValue   =response.data.project.resources.resources
        this.editMachineValue = response.data.project.resources.models
        this.editToolValue = response.data.project.resources.tools


     let item =  response.data.project

      ApiService.get("/resources/task_resource_list?start_date="+moment(String(item.start_date)).format("YYYY-MM-DD")+"&deadline="+moment(String(item.deadline)).format("YYYY-MM-DD")).then(
      response => {
           // eslint-disable-next-line no-console
          this.addProjectExternalResourceList = response.data.resources.external_resources
          this.addProjectMachinesList = response.data.resources.machines
          this.addProjectToolsList = response.data.resources.tools
      }
    );
      ApiService.get("users/task_user_list?start_date="+moment(String(item.start_date)).format("YYYY-MM-DD")+"&deadline="+moment(String(item.deadline)).format("YYYY-MM-DD")).then(
      response => {
           // eslint-disable-next-line no-console
          this.addProjectUsersList = response.data.employees
      }
    );



      this.editProjectForm.id = item.id
      this.editProjectForm.title = item.title  
      this.editProjectForm.description = item.description  
      this.editProjectForm.address = item.address  
      this.editProjectForm.post_number = item.post_number  
      this.editProjectForm.contact_person = item.contact_person  
      this.editProjectForm.start_date = new Date(item.start_date)  
      this.editProjectForm.deadline =new Date(item.deadline)
      this.editProjectModal = true

   
      },
      error => {
        this.categories =
          (error.response && error.response.companies) ||
          error.message ||
          error.toString();
      }
    );

    }
},

itemSlot(vido, props) {
  let { onChange, update, html, api, getElement } = vido;

  // Get element and initialize tippy instance
  let element, tippyInstance;
  function initialize(el) {
    element = el;
    // @ts-ignore
    if (!tippyInstance) tippyInstance = tippy(element);
  }

  let itemData, startDate, endDate, tooltipContent;
  onChange((newProps) => {
    props = newProps;
    if (!props) return;

    itemData = api.getItemData(props.item.id);
        // eslint-disable-next-line no-console
    startDate = itemData.time.startDate;
    endDate = itemData.time.endDate;
    const nm = "common."+props.item.assignType
    tooltipContent = `${this.$t(nm)} : ${props.item.labelFortooltip} <br>
                      Status: ${props.item.status} <br>
                      ${this.$t('common.Start date')} : ${startDate.format('DD MMM, YYYY')}  <br>
                      ${this.$t('common.End date')}: ${endDate.format('DD MMM, YYYY')}`;

    // render the view and after that set tippy content
    update(() => {
      tippyInstance.setContent(tooltipContent);
    });
  });

  return (content) =>
    html`<div
      directive=${getElement(initialize)}
      class="my-item" @click=${() => this.editProjectTask(props.item.assignId,props.item.assignType)}
      style="width:100%;display:flex;"
    >
      ${content}
    </div>`;
},
format_date(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
    },
format_date_m(value) {
  if (value) {
    return moment(String(value)).format("DD MMM, YYYY");
  }
},
format_date_edit(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
      },
resetModal() {
          this.showAddAlert = false;
          this.projectForm.title = null;
          this.projectForm.description = null;
          this.projectForm.address = null;
          this.projectForm.post_number = null;
          this.projectForm.contact_person = null;
      },
      resetEditModal(){
         this.showAddAlert = false;
         this.alertText = null;
         this.addDeleteUserList = [];
         this.addDeleteResourceList  = [];
      },

     changeZoomLevel(){
    // if (gstc) gstc.reload();
      state.update('config.chart.time.zoom', 22);
    },
  tatusName(status) {
      return status;
    },
    refreshEvents(){
      
         this.generateRows().then((result) => {
          
           
           


           const resourceList  = result.data.resource_dates
           const userList  = result.data.user_dates

         

           const rows = {};
           const items = {};
          if (userList != null) {
           // eslint-disable-next-line no-unused-vars
            userList.map(function(value,key){
             // eslint-disable-next-line no-console
    
             const id = GSTC.api.GSTCID("user"+value.id.toString());
             rows[id]={
               id,
               label:` ${value.first_name} ${value.last_name}`
               }
               
               const rowId = GSTC.api.GSTCID("user"+value.id.toString()).toString();
               // eslint-disable-next-line no-console

        

              const data = value.dates.filter(function(dat) { 
                return dat.status != "done"; 
                 });

               data.map(function(val){
                 if (val.assign_id != null) {
                  var ttt = val.status=="open"?"Åpen": (value.status=="done"?"Utført":(value.status=="in_progress"?"Påbegynt":"Reaktivert"))
                   items[val.id+'ww'+val.assign_id+"-"+key] = {
                   id: val.id+'ww'+val.assign_id+"-"+key,
                   assignId: val.assign_id,
                   assignType: val.assign_type,
                   labelFortooltip: val.title,
                   status: ttt,
                   isHTML: true,
                   label:`${val.assign_type=='Task'?'<i class="bx bx-task pt-1 "></i> &nbsp;':'<i class="bx bx-briefcase-alt-2 pt-1 "></i>&nbsp;'} ${val.title}`,
                   rowId: rowId,
                   time:{
                     start: new Date(moment(String(val.start)).format("YYYY-MM-DD")+" 00:00:00").getTime(),
                     end: new Date(moment(String(val.end)).format("YYYY-MM-DD")+" 23:00:00").getTime(),
                     },
                       style:{
                background: (Date.parse(val.end)< new Date()  && val.status != 'reactivated' && val.status != 'done')?"#f46a6a":(val.status == "open"?"#50a5f1":(val.status == "in_progress"?"#f1b44c":(val.status == "done"?"#34c38f":"#74788d")))
               },
               }
                }
               })
           })

    }
    if (resourceList != null) {
           // eslint-disable-next-line no-unused-vars
           resourceList.map(function(value,key){
             const id = GSTC.api.GSTCID("resource"+value.id.toString());
             rows[id]={
               id,
               label:` ${value.name}`
               }
               const rowId = GSTC.api.GSTCID("resource"+value.id.toString()).toString();
 
              const data = value.dates.filter(function(dat) { 
                return dat.status != "done"; 
                 });
               data.map(function(val){
                 
                 if (val.assign_id != null) {
                   var ttt = val.status=="open"?"Åpen": (value.status=="done"?"Utført":(value.status=="in_progress"?"Påbegynt":"Reaktivert"));

                   items[val.id+'t'+val.assign_id] = {
                     id: val.id+'t'+val.assign_id,
                     labelFortooltip: val.title,
                     status: ttt,
                     isHTML: true,
                     label:` ${val.assign_type=='Task'?'<i class="bx bx-task pt-1 "></i> &nbsp;':'<i class="bx bx-briefcase-alt-2 pt-1 "></i>&nbsp;'} ${val.title}`,
                     assignId: val.assign_id,
                     assignType: val.assign_type,
                     rowId: rowId,
                     time:{
                       start: new Date(moment(String(val.start)).format("YYYY-MM-DD")+" 00:00:00").getTime(),
                       end: new Date(moment(String(val.end)).format("YYYY-MM-DD")+" 23:00:00").getTime(),
                     },
                       style:{
               background:  (Date.parse(val.end)< new Date()  && val.status != 'reactivated' && val.status != 'done')?"#f46a6a":(val.status == "open"?"#50a5f1":(val.status == "in_progress"?"#f1b44c":(val.status == "done"?"#34c38f":"#74788d")))
               },
    }
                }
               })
           })
         }


                    for (var i = (resourceList.length+userList.length); i <= 14; i++) {
                const id = GSTC.api.GSTCID("Default"+i.toString());
             rows[id]={
               id,
               label:``
               }
            
}



    let config = {
  //  licenseKey: '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
   // licenseKey: '====BEGIN LICENSE KEY====\np/+SZrmEWVeX56surRJPMRzc0Ks9NMUG1EQtLA8WPjhu5EJqm/AyFDhyRjtCxr0pSUM/zptRN5XG4TljRhIatP/N4WIQ6rH+BXn1CgPx4yKPgZu6AuGE49P+nTxJdFjP8Ir7TuJxOAxIa87TkdrnGcR4JPim/tEf8zA1tOyqwP3pyELwE8rLAqTMW/mBUskK6n9FFftgL3b9yPN//ghvImMHaXQRXM7S0DJhD/XVeJv8z72Yt6tZbHpCI8dwpL90/mi9YPdgy3WEJ72NLWcohpUMb80y8OmKuZkNwfnm8Dpq2UnxJlbNzSWQKw1Y3kMsNnYMsvugm3EAXXfKdFroVQ==||U2FsdGVkX1+MWHUP4D/Ie6Ave8TWCuEZh8NHE5KCYt47tO9l1q57HdZrnkmtQ+wKty2VtPw/1jv+H4sXhTkIVjFlovt1EtwEBspnixR6wVA=\nJ815/8RblBcfEQ3fPYepQsZeLT6w+EFOnMFNOJaqtZRlvAaw4ih36ak7Vz5hpD1Sl5GzhnGhb1sFRbJqCS2cHpM5C7h4C4I2SKJ0IFLPdrSZ5SQD4IZVk8XsIjS0g+sPQnDk9KY/tDMAZIRC6L+8Q9h79kS9h2pf20+UYDlYEGBvuz42y5OkPqwgO1fN8qRy69VvUi2eXgDFZC6ikep4Si/X133jVLOlua3MKOyw08/QKaY4EAtcuA7y8A7PRDxUweDeaxzAFGhR411hp9tVEhC3rxSR3wd49EYLE/SEZdLHi1zuOJhhgZ32gV+hlwOrLEURMgrjwwAMOcpS8OaQVw==\n====END LICENSE KEY====',
  //  licenseKey: '====BEGIN LICENSE KEY====\nq3pIHtTt4EcjPB4DBYRqdWxMqorYFg8z1rfsOkAl9Umynd5l7m39DDNdNdhJRA5w6fmwbooTOUZ2+GfJuXlOlCbTzvei8nT+99hQwKHPjv2dlre61NKbrlJla2H/fPQDx63d3Ch/s8bmL/m/gdGhT0HezVYO3onT4jXS5ecgmx/U/uFRNx+GR02UXteh1JH7tbU0T6kybdsRPuGLgQRr/xTJahw9QGeo+lebP9n3np8xkDFVqyT+TCkIMuDQdlDxo+9AjlAPHjqpNuwG14mW3a/yOFuosZPvEFbGSFFjgcUbiOqDEsObEiZ98muDipBk4tARjkZRo/ZaBaZNXYOAjg==||U2FsdGVkX1/T74kiyqK0bRURYCmH72Q/EI3dEC1/gMOkcUjPRf50sIOaf2yRr+XE8+21WBYtrRcS9j00m9fbA9e8TrMFg+1GIK4Af7W1U+4=\naM6kDulGBIwAsH1gZkIEB+9pvnv4VO+Vc91BqHuBNka9o5ChPBYcmr9Af4acZBeVwvEM17ULFYPOyjht91g6uEdKfMmTurnKP9vy7E4EskYkZt2q0aUlFt0DDGMWgzX0WNNBMMF4K1nq/ug2+s7RqHaSbgd0d1EnGVwE7JBU+i4wcDMw25B81EhIHBM14JtGlgn29mC+KoaVtI+xpeSWWJrcwBJN/6Hja1I/l7T0yU8Fp2gJLKnKsjAwBFKjEjwstzsyvM3lDMN2Noq3+hFCIOdU8pJhp4b9RxqwEGeRUksX3OpTMnb4CNf0Edy2nzjbEy6Mq18pHUu01ZOuqOH8kg==\n====END LICENSE KEY====',
    licenseKey: '====BEGIN LICENSE KEY====\nD49ptXMSVExXBwikkOVdDgICCcm34lqZ3KO9+5W9NB8y717TJuXb1PhFn/x/Z61jDnNC0QCeeBCFkeh+68Ii4P1tVerNCZBk//44q8gph9FqljOco5jwPqZj+aC+DeY4SXNIIV8S4PIIMMy6QaZqtF7KX9pKezbcBi/A81iP7Yge8knBomh9rqUiEGXH2EuP1wRnuxLTfX4Ed5vTOQjVY86jvXZCw6y9DnSBrMQF78EJPYtCNHrRxFyNEs5gkD6NpgOtLfcYkgiZAyDAMTDWrF1/aDD5PKH4ogLNBu/ZEzo0PColHKcAIolgnublBTY4gxUrSO5mj20HKEmXGYqaWg==||U2FsdGVkX18pFIc+P9IRPvveIWkCea9moeS/b56rTW3iLrAYID0vcIG/AJzUa9CPO/9kk0+Gvdc+da1+mwIif8ZFQ4O3CWe2Y8seGc0RRPc=\nrmY6wB5dGBKVauEzfD28l5B/Acpolq2Muc3mvxrNjprYN6/bhDC7RFlzvJIi2CxLISmKgB+XXZLz5mkxWCcY5W1f1a6FcsJWs31MVeLUcGXY/RT4W+j75SDkC6Rh0DhDwqV2s4cLWxA8ZDdyEtOVJAv0KMhiz64pdwU47LNLm2Yyc2rccF/pi5zh0G9vKTS9+mONDFQbbZ3TxkTbBpnCB9wtM/cZVU0E4tpYbrW2CnF97UnrXz99s5pendEszH5HSw8tbTpv+8cxEm4SeDFG+ziH5DlhmEl4K9WxRe9BA7N1laI6luohzx3eLtfm04K1sb3/h04GsRBm63GvDnbz4w==\n====END LICENSE KEY====',
      innerHeight: 650,
locale: {
    name: 'no',
    weekdays: 'Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag'.split(
      '_'
    ),
    weekdaysShort: 'Søn_Man_Tirs_Ons_Tors_Fre_Lør'.split('_'),
    weekdaysMin: 'Søn_Man_Tirs_Ons_Tors_Fre_Lør'.split('_'),
    months: 'Januar_Februar_Mars_April_Mai_Juni_Juli_August_September_Oktober_November_Desember'.split(
      '_'
    ),
    monthsShort: 'Jan_Febr_Mars_April_Mai_Juni_Juli_Aug_Sept_Okt_Nov_Des'.split('_'),
    weekStart: 1,
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years',
    },
    formats: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY HH:mm',
      LLLL: 'dddd, D MMMM YYYY HH:mm',
    },

  },
     plugins:[TimelinePointer()],
      list:{
        columns:{
          data:{

            [GSTC.api.GSTCID('label')] :{
              id:GSTC.api.GSTCID('label'),
              width: 200,
              data:'label',
              header:{
                content: ''
              }
            }
          }
        },
        rows: rows
      },
      chart:{
        grid: {
          cell: {
            onCreate: [this.onCellCreate1],
            },
    },
        items: items
      },
         slots: {
           'chart-timeline-items-row-item': { inner: [this.itemSlot] },
          },
  
    };
    state = GSTC.api.stateFromConfig(config);
    gstc = GSTC({
      element: this.$refs.gstc,
      state,
    });
         
       
        })
  
    },
    generateRows(){
          ApiService.setHeader();
      return   axios.get('https://apipromodul.no/en/schedulers/view?type=employee')
      
      },
    updateFirstRow(){

    },
  },
  mounted() {
    this.refreshEvents()
 },


};
</script>
<style>
.gstc-component {
  margin: 0;
  padding: 0;
}
.toolbox{
  padding: 10px;
}
.titleBadge {
  position: relative;
  margin-right:10px;
  width: 22px !important;
  height: 22px;
  font-size: 11px;
 border: 2px solid #fff; 
  border-radius: 50%;
  color:#fff;
  text-align: center;
  font-weight: bold;
}
</style>