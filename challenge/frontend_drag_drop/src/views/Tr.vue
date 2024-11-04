<template>
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 drag-el" :id="data.id != '-'?'drag-item':'-'" :draggable="data.id != '-'?true:false"
        @dragstart="startDrag($event, data)" @dragover.prevent @drop="handleDrop($event, data)">
        <td class="py-4 px-6" :style="`transform: translateX(${data.id.length == 1 ? 0 :data.id.length * 10}px)`">
            <div class="w-full max-w-sm min-w-[200px]" v-if="data.id != '-'">
                <input type="text"
                    class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    :value="data.id" placeholder="Your Email"  @change="sort($event,data)"/>
            </div>
        </td>
        <td class="py-4 px-6" :style="`transform: translateX(${data.id.length == 1 ? 0 :data.id.length * 10}px)`">
            <div>{{ data.task }}</div>
        </td>
        <td class="py-4 px-6" :style="`transform: translateX(${data.id.length == 1 ? 0 :data.id.length * 10}px)`">{{ data.hrs }}</td>
        <td class="py-4 px-6" :style="`transform: translateX(${data.id.length == 1 ? 0 :data.id.length * 10}px)`">{{ data.price }}</td>
        <td class="py-4 px-6" :style="`transform: translateX(${data.id.length == 1 ? 0 :data.id.length * 10}px)`">{{ data.discount }}</td>
        <td class="py-4 px-6" :style="`transform: translateX(${data.id.length == 1 ? 0 :data.id.length * 10}px)`">{{ data.amount }}</td>
        <td class="py-4 px-12" :style="`transform: translateX(${data.id.length == 1 ? 0 :data.id.length * 10}px)`">{{ data.comment }}</td>
    </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface DataItem {
    id: string;
  task: string;
  hrs: number;
  price: number;
  discount: number;
  amount: number;
  comment: string;
  parent: string;
  child: number;
}


export default defineComponent({
    name: 'Tr',
    props: {
        data: {
            type: Object as PropType<DataItem>,
            required: true,
        },
    },
    methods: {
        startDrag(event: DragEvent, item: DataItem) {
            console.log('asd');

            event.dataTransfer?.setData('application/json', JSON.stringify(item));
        },
        handleDrop(event: DragEvent, targetData: DataItem) {
            event.preventDefault();
            const draggedDataString = event.dataTransfer?.getData('application/json');

            if (draggedDataString) {
                const draggedData: { data: DataItem } = JSON.parse(draggedDataString);
                //   console.log('Dropped Data:', draggedData);
                //   console.log('Target Data:', targetData);
                this.$emit('update-data', { draggedData, targetData });
            }
        },
        sort(event: Event, datav: DataItem) {
            const clone = { ...datav };
            this.$emit('handel-sort', { newId:(event.target as HTMLSelectElement).value,data:clone });
        }

    },
    watch: {

    }
});
</script>

<style scoped>
.drag-el {
    cursor: move;
}
</style>