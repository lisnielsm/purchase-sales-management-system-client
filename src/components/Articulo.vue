<template>
	<v-layout align-start>
		<v-flex>
			<v-data-table
				:headers="headers"
				:items="articulos"
				:search="search"
				sort-by="articulos"
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
						<v-toolbar-title>Artículos</v-toolbar-title>
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
											<v-col cols="6" sm="6" md="6">
												<v-text-field
													v-model="codigo"
													label="Código"
												></v-text-field>
											</v-col>
											<v-col cols="6" sm="6" md="6">
												<v-select
													v-model="idcategoria"
													:items="categorias"
													label="Categoría"
												></v-select>
											</v-col>
											<v-col cols="12" sm="12" md="12">
												<v-text-field
													v-model="nombre"
													label="Nombre"
												></v-text-field>
											</v-col>
											<v-col cols="6" sm="6" md="6">
												<v-text-field
													v-model.number="stock"
													label="Stock"
													type="number"
													step="1"
													min="0"
													ref="input"
												></v-text-field>
											</v-col>
											<v-col cols="6" sm="6" md="6">
												<v-text-field
													v-model.number="precio_venta"
													label="Precio Venta"
													type="number"
													step="1"
													min="0"
													ref="input"
												></v-text-field>
											</v-col>
											<v-col cols="12" sm="12" md="12">
												<v-text-field
													v-model="descripcion"
													label="Descripción"
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
		articulos: [],
		dialog: false,
		dialogDelete: false,
		headers: [
			{ text: "Opciones", value: "opciones", sortable: false },
			{ text: "Código", value: "codigo", sortable: false },
			{ text: "Nombre", value: "nombre" },
			{ text: "Categoría", value: "categoria" },
			{ text: "Stock", value: "stock", sortable: false },
			{ text: "Precio Venta", value: "precio_venta", sortable: false },
			{ text: "Descripción", value: "descripcion", sortable: false },
			{ text: "Estado", value: "condicion", sortable: false },
		],
		search: "",
		editedIndex: -1,
		id: "",
		idcategoria: "",
		categorias: [],
		codigo: "",
		nombre: "",
		stock: "",
		precio_venta: "",
		descripcion: "",
		valida: false,
		validaMensaje: [],
		adModal: false,
		adAccion: 0,
		adNombre: "",
		adId: "",
	}),

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? "Nuevo artículo" : "Actualizar artículo";
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
			let header = { "Authorization": "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				const response = await axios.get("/api/articulos/Listar", configuracion);
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

				me.articulos = data;
			} catch (error) {
				console.log(error.response);
			}
		},

		async select() {
			let me = this;
			let categoriasArray = [];
			let header = { "Authorization": "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				const response = await axios.get("/api/categorias/Select", configuracion);
				const categoriasArray = response.data;

				categoriasArray.map((c) => {
					me.categorias.push({
						text: c.nombre,
						value: c.idcategoria,
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
			this.id = item.idarticulo;
			this.idcategoria = item.idcategoria;
			this.codigo = item.codigo;
			this.nombre = item.nombre;
			this.stock = item.stock;
			this.precio_venta = item.precio_venta;
			this.descripcion = item.descripcion;
			this.editedIndex = 1;
			this.dialog = true;
		},

		close() {
			this.dialog = false;
			this.limpiar();
		},

		limpiar() {
			this.id = "";
			this.idcategoria = "";
			this.codigo = "";
			this.nombre = "";
			this.stock = "";
			this.precio_venta = "";
			this.descripcion = "";
			this.editedIndex = -1;
		},

		guardar() {
			if (this.validar()) {
				return;
			}

			let header = { "Authorization": "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			if (this.editedIndex > -1) {
				//Código para editar
				let me = this;
				axios
					.put("api/articulos/Actualizar", {
						idarticulo: me.id,
						idcategoria: me.idcategoria,
						codigo: me.codigo,
						nombre: me.nombre,
						stock: me.stock,
						precio_venta: me.precio_venta,
						descripcion: me.descripcion,
					}, configuracion)
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
					.post("api/articulos/Crear", {
						idcategoria: me.idcategoria,
						codigo: me.codigo,
						nombre: me.nombre,
						stock: me.stock,
						precio_venta: me.precio_venta,
						descripcion: me.descripcion,
					}, configuracion)
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

			if (!this.idcategoria) {
				this.validaMensaje.push("Seleccione una categoría.");
			}

			if (!this.stock || this.stock == 0) {
				this.validaMensaje.push("Ingrese el stock inicial del artículo.");
			}

			if (!this.precio_venta || this.precio_venta == 0) {
				this.validaMensaje.push("Ingrese el precio de venta del artículo.");
			}

			if (this.validaMensaje.length > 0) {
				this.valida = true;
			}

			return this.valida;
		},

		activarDesactivarMostrar(accion, item) {
			this.adModal = true;
			this.adNombre = item.nombre;
			this.adId = item.idarticulo;

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
			let header = { "Authorization": "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				const response = await axios.put("api/articulos/Activar/" + this.adId, {}, configuracion);

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
			let header = { "Authorization": "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				const response = await axios.put("api/articulos/Desactivar/" + this.adId, {}, configuracion);

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
