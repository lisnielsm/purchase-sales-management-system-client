<template>
	<v-layout align-start>
		<v-flex>
			<v-data-table
				:headers="headers"
				:items="roles"
				:search="search"
				sort-by="roles"
				class="elevation-1"
			>
				<template v-slot:[`item.condicion`]="{ item }">
					<div :class="isActive(item)">{{ item.condicion }}</div>
				</template>
				<template v-slot:no-data>
					<v-btn color="primary" @click="listar"> Resetear </v-btn>
				</template>
				<template v-slot:top>
					<v-toolbar text>
						<v-toolbar-title>Roles</v-toolbar-title>
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
		roles: [],
		dialog: false,
		dialogDelete: false,
		headers: [
			{ text: "Nombre", value: "nombre" },
			{ text: "Descripción", value: "descripcion", sortable: false },
			{ text: "Estado", value: "condicion", sortable: false },
		],
		search: "",
	}),

	computed: {},

	watch: {},

	created() {
		this.listar();
	},

	methods: {
		async listar() {
			let me = this;

			try {
				const response = await axios.get("/api/roles/Listar");
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

				me.roles = data;
			} catch (error) {
				console.log(error.response);
			}
		},

		isActive: function (item) {
			//console.log("Item", JSON.parse(JSON.stringify(item)))
			return item.condicion === "Activo" ? "blue--text" : "red--text";
		},
	},
};
</script>
