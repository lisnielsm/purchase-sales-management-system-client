<template>
	<v-layout align-start>
		<v-flex>
			<v-data-table
				:headers="showHeaders"
				:items="ingresos"
				:search="search"
				:hide-default-footer="verNuevo"
				sort-by="ingresos"
				class="elevation-1"
			>
				<template v-slot:[`item.estado`]="{ item }">
					<div :class="isAcepted(item)">{{ item.estado }}</div>
				</template>
				<template v-slot:[`item.opciones`]="{ item }">
					<v-icon small class="mr-2" @click="editItem(item)">
						mdi-pencil
					</v-icon>
					<template v-if="item.estado === 'Aceptado'">
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
						<v-toolbar-title>Ingresos</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
						<v-spacer></v-spacer>
						<v-text-field
							class="text-center"
							v-model="search"
							append-icon="search"
							label="Búsqueda"
							single-line
							hide-details
							v-if="verNuevo == false"
						></v-text-field>
						<v-spacer></v-spacer>
						<v-btn
							color="primary"
							dark
							class="mb-2"
							v-if="verNuevo == false"
							@click="mostrarNuevo"
						>
							Nuevo
						</v-btn>
						<v-dialog v-model="verArticulos" max-width="1000px">
							<v-card>
								<v-card-title>
									<span class="headline">Seleccione un artículo</span>
								</v-card-title>
								<v-card-text class="pb-0">
									<v-container grid-list-md>
										<v-layout wrap>
											<v-flex xs12 sm12 md12 lg12 xl12>
												<v-text-field
													append-icon="search"
													class="text-center"
													v-model="texto"
													label="Ingrese artículo a buscar"
													@keyup.enter="listarArticulo()"
												>
												</v-text-field>
												<template>
													<v-data-table
														:headers="cabeceraArticulos"
														:items="articulos"
														class="elevation-1"
													>
														<template v-slot:[`item.seleccionar`]="{ item }">
															<v-icon
																small
																class="mr-2"
																@click="agregarDetalleModal(item)"
															>
																add
															</v-icon>
														</template>
														<template v-slot:no-data>
															<h3>No hay artículos para mostrar.</h3>
														</template>
													</v-data-table>
												</template>
											</v-flex>
										</v-layout>
									</v-container>
								</v-card-text>
								<v-flex
									xs12
									sm12
									md12
									lg12
									xl12
									v-if="itemAgregado"
									class="text-center"
								>
									<div class="green--text">
										El artículo con nombre {{ itemAgregado }} se agregó
										correctamente
									</div>
								</v-flex>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn @click="ocultarArticulos()" color="blue darken" text>
										Cancelar
									</v-btn>
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
			<v-container grid-list-sm class="pa-4 white elevation-1" v-if="verNuevo">
				<v-layout row wrap>
					<v-flex xs12 sm4 md4 lg4 xl4>
						<v-select
							v-model="tipo_comprobante"
							:items="comprobantes"
							label="Tipo Comprobante"
							class="px-1"
						>
						</v-select>
					</v-flex>
					<v-flex xs12 sm4 md4 lg4 xl4>
						<v-text-field
							v-model="serie_comprobante"
							label="Serie Comprobante"
							class="px-1"
						>
						</v-text-field>
					</v-flex>
					<v-flex xs12 sm4 md4 lg4 xl4>
						<v-text-field
							v-model="num_comprobante"
							label="Número Comprobante"
							class="px-1"
						>
						</v-text-field>
					</v-flex>
					<v-flex xs12 sm8 md8 lg8 xl8>
						<v-select
							v-model="idproveedor"
							:items="proveedores"
							label="Proveedor"
							class="px-1"
						>
						</v-select>
					</v-flex>
					<v-flex xs12 sm4 md4 lg4 xl4>
						<v-text-field
							type="number"
							v-model="impuesto"
							label="Impuesto"
							class="px-1"
						>
						</v-text-field>
					</v-flex>
					<v-flex xs12 sm8 md8 lg8 xl8>
						<v-text-field
							@keyup.enter="buscarCodigo()"
							v-model="codigo"
							label="Código"
						>
						</v-text-field>
					</v-flex>
					<v-flex xs12 sm1 md1 lg1 xl1>
						<v-btn
							small
							fab
							dark
							color="teal"
							class="ml-2 mt-2"
							@click="mostrarArticulos()"
						>
							<v-icon dark>list</v-icon>
						</v-btn>
					</v-flex>
					<v-flex xs12 sm3 md3 lg3 xl3 v-if="errorArticulo" align-self-center>
						<div class="red--text" v-text="errorArticulo"></div>
					</v-flex>
					<v-flex xs12 sm12 md12 lg12 xl12>
						<v-data-table
							:headers="cabeceraDetalles"
							:items="detalles"
							hide-default-footer
							class="elevation-1"
						>
							<template v-slot:[`item.borrar`]="{ item }">
								<v-icon
									small
									class="mr-2"
									@click="eliminarDetalle(detalles, item)"
								>
									mdi-delete
								</v-icon>
							</template>
							<template v-slot:[`item.cantidad`]="{ item }">
								<v-text-field
									type="number"
									v-model="item.cantidad"
									autofocus
								></v-text-field>
							</template>
							<template v-slot:[`item.precio`]="{ item }">
								<v-text-field
									type="number"
									v-model="item.precio"
								></v-text-field>
							</template>
							<template v-slot:[`item.subtotal`]="{ item }">
								<div>$ {{ item.cantidad * item.precio }}</div>
							</template>
							<template v-slot:no-data>
								<h3>No hay artículos agregados al detalle</h3>
							</template>
						</v-data-table>
						<v-flex class="text-right mt-2">
							<strong>Total Parcial: </strong>$
							{{ (totalParcial = (total - totalImpuesto).toFixed(2)) }}
						</v-flex>
						<v-flex class="text-right">
							<strong>Total Impuesto: </strong>$
							{{
								(totalImpuesto = (
									(total * impuesto) /
									(100 + impuesto)
								).toFixed(2))
							}}
						</v-flex>
						<v-flex class="text-right">
							<strong>Total Neto: </strong>$
							{{ (total = calcularTotal.toFixed(2)) }}
						</v-flex>
					</v-flex>
					<v-flex xs12 sm12 md12 lg12 xl12>
						<div
							class="red--text"
							v-for="v in validaMensaje"
							:key="v"
							v-text="v"
						></div>
					</v-flex>
					<v-flex xs12 sm12 md12 lg12 xl12 class="mt-2">
						<v-btn color="blue darken-1" text @click="ocultarNuevo()">
							Cancelar
						</v-btn>
						<v-btn color="success" @click="guardar()">Guardar</v-btn>
					</v-flex>
				</v-layout>
			</v-container>
		</v-flex>
	</v-layout>
</template>

<script>
import axios from "axios";

export default {
	data: () => ({
		ingresos: [],
		dialog: false,
		headers: [
			{ text: "Opciones", value: "opciones", sortable: false },
			{ text: "Usuario", value: "usuario" },
			{ text: "Proveedor", value: "proveedor" },
			{ text: "Tipo Comprobante", value: "tipo_comprobante" },
			{
				text: "Serie Comprobante",
				value: "serie_comprobante",
				sortable: false,
			},
			{ text: "Número Comprobante", value: "num_comprobante", sortable: false },
			{ text: "Fecha", value: "fecha_hora", sortable: false },
			{ text: "Impuesto", value: "impuesto", sortable: false },
			{ text: "Total", value: "total", sortable: false },
			{ text: "Estado", value: "estado", sortable: false },
		],
		cabeceraDetalles: [
			{ text: "Borrar", value: "borrar", sortable: false },
			{ text: "Artículo", value: "articulo", sortable: false },
			{ text: "Cantidad", value: "cantidad", sortable: false },
			{ text: "Precio", value: "precio", sortable: false },
			{ text: "Subtotal", value: "subtotal", sortable: false },
		],
		detalles: [],
		search: "",
		id: "",
		idproveedor: "",
		proveedores: [],
		tipo_comprobante: "",
		comprobantes: ["FACTURA", "BOLETA", "TICKET", "GUIA"],
		serie_comprobante: "",
		num_comprobante: "",
		impuesto: 18,
		codigo: "",
		verNuevo: false,
		errorArticulo: null,
		itemAgregado: null,
		totalParcial: 0,
		totalImpuesto: 0,
		total: 0,
		cabeceraArticulos: [
			{ text: "Seleccionar", value: "seleccionar", sortable: false },
			{ text: "Artículo", value: "nombre" },
			{ text: "Categoría", value: "categoria" },
			{ text: "Descripción", value: "descripcion", sortable: false },
			{ text: "Stock", value: "stock", sortable: false },
			{ text: "Precio Venta", value: "precio_venta", sortable: false },
		],
		articulos: [],
		texto: "",
		verArticulos: false,
		valida: 0,
		validaMensaje: [],
		adModal: 0,
		adAccion: 0,
		adNombre: "",
		adId: "",
	}),

	computed: {
		calcularTotal: function () {
			var resultado = 0.0;
			for (var i = 0; i < this.detalles.length; i++) {
				resultado =
					resultado + this.detalles[i].precio * this.detalles[i].cantidad;
			}
			return resultado;
		},

		showHeaders() {
			let newHeaders = [];

			if (this.verNuevo) {
				return newHeaders;
			}

			newHeaders = this.headers;

			return newHeaders;
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
		mostrarNuevo() {
			this.verNuevo = true;
		},

		ocultarNuevo() {
			this.verNuevo = false;
			this.limpiar();
		},

		async buscarCodigo() {
			let me = this;
			me.errorArticulo = null;
			let header = { Authorization: "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				const response = await axios.get(
					"api/articulos/BuscarCodigoIngreso/" + this.codigo,
					configuracion
				);
				me.agregarDetalle(response.data);
			} catch (error) {
				console.log(error.response);
				me.errorArticulo = "No existe el artículo";
			}
		},

		listarArticulo() {
			let me = this;
			let header = { Authorization: "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };
			axios
				.get("api/articulos/ListarIngreso/" + me.texto, configuracion)
				.then(function (response) {
					me.articulos = response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
		},

		mostrarArticulos() {
			this.verArticulos = true;
		},

		ocultarArticulos() {
			this.verArticulos = false;
			this.itemAgregado = null;
		},

		encuentra(id) {
			var sw = 0;

			for (var i = 0; i < this.detalles.length; i++) {
				if (this.detalles[i].idarticulo == id) {
					sw = 1;
				}
			}
			return sw;
		},

		eliminarDetalle(arr, item) {
			var i = arr.indexOf(item);
			if (i !== -1) {
				arr.splice(i, 1);
			}
		},

		agregarDetalleModal(item) {
			this.itemAgregado = item.nombre;
			this.agregarDetalle(item);
		},

		agregarDetalle(data = []) {
			this.errorArticulo = null;
			if (this.encuentra(data["idarticulo"])) {
				this.errorArticulo = "El artículo ya ha sido agregado.";
			} else {
				this.detalles.push({
					idarticulo: data["idarticulo"],
					articulo: data["nombre"],
					cantidad: 1,
					precio: 1,
				});
			}
		},

		async listar() {
			let me = this;
			let header = { Authorization: "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				const response = await axios.get("/api/ingresos/Listar", configuracion);
				me.ingresos = response.data;
			} catch (error) {
				console.log(error.response);
			}
		},

		async select() {
			let me = this;
			var proveedoresArray = [];
			let header = { Authorization: "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				const response = await axios.get(
					"api/personas/SelectProveedores",
					configuracion
				);
				proveedoresArray = response.data;

				proveedoresArray.map(function (x) {
					me.proveedores.push({ text: x.nombre, value: x.idpersona });
				});
			} catch (error) {
				console.log(error.response);
			}
		},

		isAcepted: function (item) {
			return item.estado === "Aceptado" ? "blue--text" : "red--text";
		},

		limpiar() {
			this.id = "";
			this.idproveedor = "";
			this.tipo_comprobante = "";
			this.serie_comprobante = "";
			this.num_comprobante = "";
			this.impuesto = "18";
			this.codigo = "";
			this.detalles = [];
			this.total = 0;
			this.totalImpuesto = 0;
			this.totalParcial = 0;
		},

		guardar() {
			if (this.validar()) {
				return;
			}
			let header = { Authorization: "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };
			let me = this;
			axios
				.post(
					"api/Ingresos/Crear",
					{
						idproveedor: me.idproveedor,
						idusuario: me.$store.state.usuario.idusuario,
						tipo_comprobante: me.tipo_comprobante,
						serie_comprobante: me.serie_comprobante,
						num_comprobante: me.num_comprobante,
						impuesto: me.impuesto,
						total: me.total,
						detalles: me.detalles,
					},
					configuracion
				)
				.then(function (response) {
					me.ocultarNuevo();
					me.listar();
					me.limpiar();
				})
				.catch(function (error) {
					console.log(error);
				});
		},

		validar() {
			this.valida = 0;
			this.validaMensaje = [];

			if (!this.idproveedor) {
				this.validaMensaje.push("Seleccione un proveedor.");
			}
			if (!this.tipo_comprobante) {
				this.validaMensaje.push("Seleccione un tipo de comprobante.");
			}
			if (!this.num_comprobante) {
				this.validaMensaje.push("Ingrese el número del comprobante.");
			}
			if (!this.impuesto || this.impuesto < 0) {
				this.validaMensaje.push("Ingrese un impuesto válido.");
			}
			if (this.detalles.length <= 0) {
				this.validaMensaje.push("Ingrese al menos un artículo al detalle.");
			}
			if (this.validaMensaje.length) {
				this.valida = 1;
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
			let header = { Authorization: "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				await axios.put("api/usuarios/Activar/" + this.adId, {}, configuracion);

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
			let header = { Authorization: "Bearer " + this.$store.state.token };
			let configuracion = { headers: header };

			try {
				await axios.put(
					"api/usuarios/Desactivar/" + this.adId,
					{},
					configuracion
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
