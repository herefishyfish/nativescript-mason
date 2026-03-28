<template>
        <Page>
            <ActionBar title="Profession Examples" />
            <Div class="page" style="overflow-y: auto; padding: 12;">
                <Div class="prof-grid">
                    <Button v-for="p in professions" :key="p.slug" @tap="open(p.slug)">
                        <Text :text="p.name" />
                    </Button>
                </Div>
            </Div>
        </Page>
</template>

<script lang="ts" setup>
import { $navigateTo } from 'nativescript-vue';
import DesignerDemo from '~/web-samples/professions/Designer.vue';
import DeveloperDemo from '~/web-samples/professions/Developer.vue';
import PhotographerDemo from '~/web-samples/professions/Photographer.vue';
import ChefDemo from '~/web-samples/professions/Chef.vue';
import DoctorDemo from '~/web-samples/professions/Doctor.vue';
import LawyerDemo from '~/web-samples/professions/Lawyer.vue';
import TeacherDemo from '~/web-samples/professions/Teacher.vue';
import ArchitectDemo from '~/web-samples/professions/Architect.vue';
import MusicianDemo from '~/web-samples/professions/Musician.vue';
import MarketerDemo from '~/web-samples/professions/Marketer.vue';



const professions = [
    { name: 'Designer', slug: 'designer' },
    { name: 'Developer', slug: 'developer' },
    { name: 'Photographer', slug: 'photographer' },
    { name: 'Chef', slug: 'chef' },
    { name: 'Doctor', slug: 'doctor' },
    { name: 'Lawyer', slug: 'lawyer' },
    { name: 'Teacher', slug: 'teacher' },
    { name: 'Architect', slug: 'architect' },
    { name: 'Musician', slug: 'musician' },
    { name: 'Marketer', slug: 'marketer' },
];

const open = (slug: string) => {
    const mapping: any = {
        designer: DesignerDemo,
        developer: DeveloperDemo,
        photographer: PhotographerDemo,
        chef: ChefDemo,
        doctor: DoctorDemo,
        lawyer: LawyerDemo,
        teacher: TeacherDemo,
        architect: ArchitectDemo,
        musician: MusicianDemo,
        marketer: MarketerDemo,
    };
    // @ts-ignore
    $navigateTo(mapping[slug]);
};
</script>

<style scoped>
.page {
    padding: 16
}

.prof-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8;
    padding: 8
}

.prof-grid Button {
    min-width: 120;
    margin: 6
}
</style>
