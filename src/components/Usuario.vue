<template>
	<v-layout align-start>
		<v-flex>
			<v-data-table
				:headers="headers"
				:items="usuarios"
				:search="search"
				sort-by="usuarios"
				class="elevation-1"
			>
				<template v-slot:[`item.condicion`]="{ item }">
					<div :class="isActive(item)">{{ item.condicion }}</div>
				</template>
				<template v-slot:[`item.opciones`]="{ item }">
					<v-icon small class="mr-2" @click="editItem(item)">
						mdi-pencil
					</v-icon>
					<template v-if="item.condicion === 'Activo'">
						<v-icon small @click="activarDesactivarMostrar(2, item)">
							block
						</v-icon>
					</template>
					<template v-else>
						<v-icon small @click="activarDesactivarMostrar(1, item)">
							check
						</v-icon>
					</template>
				</template>
				<template v-slot:no-data>
					<v-btn color="primary" @click="listar"> Resetear </v-btn>
				</template>
				<template v-slot:top>
					<v-toolbar text>
						<v-toolbar-title>Usuarios</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
						<v-spacer></v-spacer>
						<v-text-field
							class="text-center"
							v-model="search"
							append-icon="search"
							label="Búsqueda"
							single-line
							hide-details
						></v-text-field>
						<v-spacer></v-spacer>
						<v-dialog v-model="dialog" max-width="500px">
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									color="primary"
									dark
									class="mb-2"
									v-bind="attrs"
									v-on="on"
								>
									Nuevo
								</v-btn>
							</template>
							<v-card>
								<v-card-title>
									<span class="text-h5">{{ formTitle }}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-row>
											<v-col cols="12" sm="6" md="6">
												<v-text-field
													v-model="nombre"
													label="Nombre"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-select
													v-model="idrol"
													:items="roles"
													label="Roles"
												></v-select>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-select
													v-model="tipo_documento"
													:items="documentos"
													label="Tipo documento"
												></v-select>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field
													v-model="num_documento"
													label="Número documento"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field
													v-model="direccion"
													label="Dirección"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field
													v-model="telefono"
													label="Teléfono"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field
													v-model="email"
													label="Email"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field
													v-model="password"
													label="Password"
													type="password"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="12" md="12" v-show="valida">
												<div
													class="red--text"
													v-for="v in validaMensaje"
													:key="v"
													v-text="v"
												></div>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="blue darken-1" text @click="close"
										>Cancelar</v-btn
									>
									<v-btn color="blue darken-1" text @click="guardar"
										>Guardar</v-btn
									>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="adModal" max-width="350px">
							<v-card>
								<v-card-title class="headline" v-if="adAccion == 1">
									¿Activar item?
								</v-card-title>
								<v-card-title class="headline" v-if="adAccion == 2">
									Desactivar item?
								</v-card-title>
								<v-card-text>
									Estas a punto de
									<span v-if="adAccion == 1">Activar</span>
									<span v-if="adAccion == 2">Desactivar</span>
									el item {{ adNombre }}
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										color="green darken-1"
										text
										@click="activarDesactivarCerrar"
									>
										Cancelar
									</v-btn>
									<v-btn
										v-if="adAccion == 1"
										color="orange darken-4"
										text
										@click="activar"
									>
										Activar
									</v-btn>
									<v-btn
										v-if="adAccion == 2"
										color="orange darken-4"
										text
										@click="desactivar"
									>
										Desactivar
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-toolbar>
				</template>
			</v-data-table>
		</v-flex>
	</v-layout>
</template>

<script>
import axios from "axios";

export default {
	data: () => ({
		usuarios: [],
		dialog: false,
		dialogDelete: false,
		headers: [
			{ text: "Opciones", value: "opciones", sortable: false },
			{ text: "Nombre", value: "nombre" },
			{ text: "Rol", value: "rol" },
			{ text: "Tipo Documento", value: "tipo_documento" },
			{ text: "Número Documento", value: "num_documento", sortable: false },
			{ text: "Dirección", value: "direccion", sortable: false },
			{ text: "Télefono", value: "telefono", sortable: false },
			{ text: "Email", value: "email", sortable: false },
			{ text: "Estado", value: "condicion", sortable: false },
		],
		search: "",
		editedIndex: -1,
		id: "",
		idrol: "",
		roles: [],
		nombre: "",
		tipo_documento: "",
		documentos: ["DNI", "RUC", "PASAPORTE", "CEDULA"],
		num_documento: "",
		direccion: "",
		telefono: "",
		email: "",
		password: "",
		actPassword: false,
		passwordAnt: "",
		valida: false,
		validaMensaje: [],
		adModal: false,
		adAccion: 0,
		adNombre: "",
		adId: "",
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "Nuevo usuario" : "Actualizar usuario";
		},
	},

	watch: {
		dialog(val) {
			val || this.close();
		},
		dialogDelete(val) {
			val || this.closeDelete();
		},
	},

	created() {
		this.listar();
		this.select();
	},

	methods: {
		async listar() {
			let me = this;

			try {
				const response = await axios.get("/api/usuarios/Listar");
				const items = response.data;
				const data = [];

				for (let item of items) {
					if (item.condicion) {
						item.condicion = "Activo";
					} else {
						item.condicion = "Inactivo";
					}

					data.push(item);
				}

				me.usuarios = data;
			} catch (error) {
				console.log(error.response);
			}
		},

		async select() {
			let me = this;
			let rolesArray = [];

			try {
				const response = await axios.get("/api/roles/Select");
				const rolesArray = response.data;

				rolesArray.map((r) => {
					me.roles.push({
						text: r.nombre,
						value: r.idrol,
					});
				});
			} catch (error) {
				console.log(error.response);
			}
		},

		isActive: function (item) {
			return item.condicion === "Activo" ? "blue--text" : "red--text";
		},

		editItem(item) {
			this.id = item.idusuario;
			this.idrol = item.idrol;
			this.nombre = item.nombre;
			this.rol = item.rol;
			this.tipo_documento = item.tipo_documento;
			this.num_documento = item.num_documento;
			this.direccion = item.direccion;
			this.telefono = item.telefono;
			this.email = item.email;
			this.password = item.password_hash;
			this.passwordAnt = item.password_hash;
			this.editedIndex = 1;
			this.dialog = true;
		},

		close() {
			this.dialog = false;
			this.limpiar();
		},

		limpiar() {
			this.id = "";
			this.idrol = "";
			this.nombre = "";
			this.rol = "";
			this.tipo_documento = "";
			this.num_documento = "";
			this.direccion = "";
			this.telefono = "";
			this.email = "";
			this.password = "";
			this.passwordAnt = "";
			this.actPassword = false;
			this.editedIndex = -1;
		},

		guardar() {
			if (this.validar()) {
				return;
			}

			if (this.editedIndex > -1) {
				//Código para editar
				let me = this;

				if (me.password !== me.passwordAnt) {
					me.actPassword = true;
				}

				axios
					.put("api/usuarios/Actualizar", {
						idusuario: me.id,
						idrol: me.idrol,
						nombre: me.nombre,
						tipo_documento: me.tipo_documento,
						num_documento: me.num_documento,
						direccion: me.direccion,
						telefono: me.telefono,
						email: me.email,
						password: me.password,
						act_password: me.actPassword,
					})
					.then(function (response) {
						me.close();
						me.listar();
						me.limpiar();
					})
					.catch(function (error) {
						console.log(error);
					});
			} else {
				//Código para guardar
				let me = this;
				axios
					.post("api/usuarios/Crear", {
						idrol: me.idrol,
						nombre: me.nombre,
						tipo_documento: me.tipo_documento,
						num_documento: me.num_documento,
						direccion: me.direccion,
						telefono: me.telefono,
						email: me.email,
						password: me.password,
					})
					.then(function (response) {
						me.close();
						me.listar();
						me.limpiar();
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		},

		validar() {
			this.valida = false;
			this.validaMensaje = [];

			if (this.nombre.length < 3 || this.nombre.length > 50) {
				this.validaMensaje.push(
					"El nombre debe tener mas de 2 caracteres y menos de 50 caracteres."
				);
			}

			if (!this.idrol) {
				this.validaMensaje.push("Seleccione un rol.");
			}

			if (!this.tipo_documento) {
				this.validaMensaje.push("Seleccione un tipo documento.");
			}

			if (!this.email) {
				this.validaMensaje.push("Ingrese el email del usuario.");
			}

			if (!this.password) {
				this.validaMensaje.push("Ingrese el password del usuario.");
			}

			if (this.validaMensaje.length > 0) {
				this.valida = true;
			}

			return this.valida;
		},

		activarDesactivarMostrar(accion, item) {
			this.adModal = true;
			this.adNombre = item.nombre;
			this.adId = item.idusuario;

			if (accion === 1) {
				this.adAccion = 1;
			} else if (accion === 2) {
				this.adAccion = 2;
			} else {
				this.adModal = false;
			}
		},

		activarDesactivarCerrar() {
			this.adModal = false;
		},

		async activar() {
			let me = this;

			try {
				const response = await axios.put("api/usuarios/Activar/" + this.adId);

				me.adModal = false;
				me.adAccion = 0;
				me.adNombre = "";
				me.adId = "";

				me.listar();
			} catch (error) {
				console.log(error.response);
			}
		},

		async desactivar() {
			let me = this;

			try {
				const response = await axios.put(
					"api/usuarios/Desactivar/" + this.adId
				);

				me.adModal = false;
				me.adAccion = 0;
				me.adNombre = "";
				me.adId = "";

				me.listar();
			} catch (error) {
				console.log(error.response);
			}
		},
	},
};
</script>
