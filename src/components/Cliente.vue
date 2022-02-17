<template>
	<v-layout align-start>
		<v-flex>
			<v-data-table
				:headers="headers"
				:items="clientes"
				:search="search"
				sort-by="clientes"
				class="elevation-1"
			>
				<template v-slot:[`item.opciones`]="{ item }">
					<v-icon small class="mr-2" @click="editItem(item)">
						mdi-pencil
					</v-icon>
				</template>
				<template v-slot:no-data>
					<v-btn color="primary" @click="listar"> Resetear </v-btn>
				</template>
				<template v-slot:top>
					<v-toolbar text>
						<v-toolbar-title>Clientes</v-toolbar-title>
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
											<v-col cols="12" sm="12" md="12">
												<v-text-field
													v-model="nombre"
													label="Nombre"
												></v-text-field>
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
											<v-col cols="12" sm="12" md="12">
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
		clientes: [],
		dialog: false,
		dialogDelete: false,
		headers: [
			{ text: "Opciones", value: "opciones", sortable: false },
			{ text: "Nombre", value: "nombre" },
			{ text: "Tipo Persona", value: "tipo_persona", sortable: false },
			{ text: "Tipo Documento", value: "tipo_documento" },
			{ text: "Número Documento", value: "num_documento", sortable: false },
			{ text: "Dirección", value: "direccion", sortable: false },
			{ text: "Télefono", value: "telefono", sortable: false },
			{ text: "Email", value: "email", sortable: false },
		],
		search: "",
		editedIndex: -1,
		id: "",
		nombre: "",
		tipo_documento: "",
		documentos: ["DNI", "RUC", "PASAPORTE", "CEDULA"],
		num_documento: "",
		direccion: "",
		telefono: "",
		email: "",
		valida: false,
		validaMensaje: [],
		adModal: false,
		adAccion: 0,
		adNombre: "",
		adId: "",
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "Nuevo cliente" : "Actualizar cliente";
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
	},

	methods: {
		async listar() {
			let me = this;

			try {
				const response = await axios.get("/api/personas/ListarClientes");
				me.clientes = response.data;
			} catch (error) {
				console.log(error.response);
			}
		},

		editItem(item) {
			this.id = item.idpersona;
			this.nombre = item.nombre;
			this.tipo_documento = item.tipo_documento;
			this.num_documento = item.num_documento;
			this.direccion = item.direccion;
			this.telefono = item.telefono;
			this.email = item.email;
			this.editedIndex = 1;
			this.dialog = true;
		},

		close() {
			this.dialog = false;
			this.limpiar();
		},

		limpiar() {
			this.id = "";
			this.nombre = "";
			this.tipo_documento = "";
			this.num_documento = "";
			this.direccion = "";
			this.telefono = "";
			this.email = "";
			this.editedIndex = -1;
		},

		guardar() {
			if (this.validar()) {
				return;
			}

			if (this.editedIndex > -1) {
				//Código para editar
				let me = this;

				axios
					.put("api/personas/Actualizar", {
						idpersona: me.id,
						tipo_persona: "Cliente",
						nombre: me.nombre,
						tipo_documento: me.tipo_documento,
						num_documento: me.num_documento,
						direccion: me.direccion,
						telefono: me.telefono,
						email: me.email,
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
					.post("api/personas/Crear", {
						tipo_persona: "Cliente",
						nombre: me.nombre,
						tipo_documento: me.tipo_documento,
						num_documento: me.num_documento,
						direccion: me.direccion,
						telefono: me.telefono,
						email: me.email,
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

			if (!this.tipo_documento) {
				this.validaMensaje.push("Seleccione un tipo documento.");
			}

			if (this.validaMensaje.length > 0) {
				this.valida = true;
			}

			return this.valida;
		},
	},
};
</script>
