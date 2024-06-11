<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Float } from '@threlte/extras';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { Mesh } from 'three';
	import { PredatorService } from './predator-service';

	let mesh: Mesh;
	let rigidBody: RigidBody;
	let predatorService: PredatorService;

	$: if (mesh && rigidBody) {
		predatorService = new PredatorService(mesh, rigidBody);
	}

	useTask((delta) => {
		predatorService.updateTrajectory(delta);
	});
</script>

<T.Group bind:ref={mesh}>
	<RigidBody bind:rigidBody gravityScale={0}>
		<AutoColliders>
			<Float speed={10}>
				<T.Mesh>
					<T.SphereGeometry args={[0.5, 32, 32]} />
					<T.MeshStandardMaterial color="green" />
				</T.Mesh>
			</Float>
		</AutoColliders>
	</RigidBody>
</T.Group>
