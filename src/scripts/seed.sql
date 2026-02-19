-- =============================================
-- Seed Data: Categories and Products
-- =============================================

INSERT INTO categories (name) VALUES
	('Backpacks'),
	('Tents'),
	('Sleeping Bags'),
	('Sleeping Pads'),
	('Camp Cookware'),
	('Water Bottles'),
	('Water Filters'),
	('Headlamps'),
	('Lanterns'),
	('Hiking Poles'),
	('First Aid'),
	('Navigation'),
	('Outdoor Kitchen'),
	('Camp Furniture'),
	('Climbing Gear'),
	('Trail Tools'),
	('Coolers'),
	('Fire Starters'),
	('Dry Bags'),
	('Repair Kits');

INSERT INTO products (name, description, price, category_id, image_url, featured) VALUES
	(
		'Summit 45L Pack',
		'Lightweight 45L hiking pack with ventilated back panel and removable rain cover.',
		129.99,
		(SELECT id FROM categories WHERE name = 'Backpacks'),
		'/images/products/summit-45l-pack.jpg',
		TRUE
	),
	(
		'Ridgeline 2P Tent',
		'Freestanding two-person tent with aluminum poles and full-coverage fly.',
		219.00,
		(SELECT id FROM categories WHERE name = 'Tents'),
		'/images/products/ridgeline-2p-tent.jpg',
		TRUE
	),
	(
		'Boreal 20F Sleeping Bag',
		'Synthetic insulation sleeping bag rated to 20F with draft collar.',
		149.50,
		(SELECT id FROM categories WHERE name = 'Sleeping Bags'),
		'/images/products/boreal-20f-bag.jpg',
		FALSE
	),
	(
		'Strata Air Pad',
		'Ultralight inflatable sleeping pad with integrated pump sack.',
		89.95,
		(SELECT id FROM categories WHERE name = 'Sleeping Pads'),
		'/images/products/strata-air-pad.jpg',
		FALSE
	),
	(
		'TrailChef Cookset',
		'Two-pot anodized aluminum cookset with nesting bowls and lid.',
		64.00,
		(SELECT id FROM categories WHERE name = 'Camp Cookware'),
		'/images/products/trailchef-cookset.jpg',
		FALSE
	),
	(
		'Canyon 32oz Bottle',
		'Insulated stainless steel bottle keeps drinks cold for 24 hours.',
		29.95,
		(SELECT id FROM categories WHERE name = 'Water Bottles'),
		'/images/products/canyon-32oz-bottle.jpg',
		TRUE
	),
	(
		'StreamGuard Filter',
		'Compact water filter removes bacteria and protozoa for backcountry use.',
		54.99,
		(SELECT id FROM categories WHERE name = 'Water Filters'),
		'/images/products/streamguard-filter.jpg',
		FALSE
	),
	(
		'Aurora 300 Headlamp',
		'300-lumen headlamp with red mode and USB-C rechargeable battery.',
		39.00,
		(SELECT id FROM categories WHERE name = 'Headlamps'),
		'/images/products/aurora-300-headlamp.jpg',
		TRUE
	),
	(
		'Beacon Camp Lantern',
		'Collapsible LED lantern with warm glow and 48-hour runtime.',
		44.50,
		(SELECT id FROM categories WHERE name = 'Lanterns'),
		'/images/products/beacon-lantern.jpg',
		FALSE
	),
	(
		'Summit Trek Poles',
		'Carbon fiber trekking poles with cork grips and quick locks.',
		119.00,
		(SELECT id FROM categories WHERE name = 'Hiking Poles'),
		'/images/products/summit-trek-poles.jpg',
		FALSE
	),
	(
		'Alpine First Aid Kit',
		'Adventure-ready first aid kit with organized compartments.',
		34.00,
		(SELECT id FROM categories WHERE name = 'First Aid'),
		'/images/products/alpine-first-aid-kit.jpg',
		FALSE
	),
	(
		'Trail Compass Pro',
		'Liquid-filled compass with declination adjustment and mirror.',
		27.50,
		(SELECT id FROM categories WHERE name = 'Navigation'),
		'/images/products/trail-compass-pro.jpg',
		FALSE
	),
	(
		'Camp Flame Stove',
		'Compact canister stove with quick ignition and windscreen.',
		52.00,
		(SELECT id FROM categories WHERE name = 'Outdoor Kitchen'),
		'/images/products/camp-flame-stove.jpg',
		TRUE
	),
	(
		'Pinecrest Camp Chair',
		'Folding camp chair with mesh back and cup holder.',
		39.99,
		(SELECT id FROM categories WHERE name = 'Camp Furniture'),
		'/images/products/pinecrest-chair.jpg',
		FALSE
	),
	(
		'Granite Climb Harness',
		'Adjustable climbing harness with gear loops and padded waist.',
		79.00,
		(SELECT id FROM categories WHERE name = 'Climbing Gear'),
		'/images/products/granite-harness.jpg',
		FALSE
	),
	(
		'TrailFix Multi-Tool',
		'Pocket multi-tool with knife, pliers, and screwdriver bits.',
		24.95,
		(SELECT id FROM categories WHERE name = 'Trail Tools'),
		'/images/products/trailfix-multitool.jpg',
		FALSE
	),
	(
		'Glacier 45 Cooler',
		'Rotomolded cooler keeps ice for up to 4 days.',
		189.00,
		(SELECT id FROM categories WHERE name = 'Coolers'),
		'/images/products/glacier-45-cooler.jpg',
		TRUE
	),
	(
		'SparkPath Fire Starter',
		'Ferro rod fire starter with striker and lanyard.',
		14.99,
		(SELECT id FROM categories WHERE name = 'Fire Starters'),
		'/images/products/sparkpath-fire-starter.jpg',
		FALSE
	),
	(
		'Drift 15L Dry Bag',
		'Waterproof roll-top dry bag for river and rain protection.',
		18.00,
		(SELECT id FROM categories WHERE name = 'Dry Bags'),
		'/images/products/drift-15l-drybag.jpg',
		FALSE
	),
	(
		'Field Repair Kit',
		'Patch kit for tents, pads, and inflatables with adhesive backing.',
		12.50,
		(SELECT id FROM categories WHERE name = 'Repair Kits'),
		'/images/products/field-repair-kit.jpg',
		FALSE
	);

INSERT INTO images (url, description) VALUES 
('https://cdn.pixabay.com/photo/2020/07/01/20/32/mountain-5360913_1280.jpg', 'mountain, person, lake image'),
('https://cdn.pixabay.com/photo/2017/03/07/14/19/mountain-climbing-2124113_1280.jpg', 'mountain climbing, 5 dragon peak, the chubu sangaku national park, japan, snow, snow mountain, nature, summit, cold, wind, climbers, altitude, winter mountaineering, landscape, winter, mountain, peak image'),
('https://cdn.pixabay.com/photo/2020/10/11/09/04/peak-5645235_1280.jpg', 'peak, summit, mountains, nature, snow mountains, alps, alpine, mountain range, mountain landscape, mountainous, landscape, snow, clouds, switzerland image'),
('https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'hiker, backpack, green plants, grass, woman, summer, mountains, outdoor, grass, hiking, adventure, colorado, backpack, hat, explore, hiker, follow, nature, travel, life image'),
('https://images.unsplash.com/photo-1626309345162-ed4228c9831c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'person, green jacket, pathway, mountains, explore, hike, human, green, photography, photo, hiking, usa, walking, path, outdoors, mountain range, trail, peak, slope, port angeles image'),
('https://images.unsplash.com/photo-1606788902870-b0d6fd44ad83?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'human, road, photography, grey, photo, scenery, hiking, adventure, walking, rock, path, outdoors, mountain range, colorado, trail, wilderness, peak, slope, leisure activities image'),
('https://images.unsplash.com/photo-1560354790-a403c5a97e0f?q=80&w=1208&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'running, run, runner, trail, rocky mountains, green mountains, hiking trail, summer mountains, rockies, trail runner, mountain runner, human, blue, land, road, plant, grass, scenery, hiking, field image'),
('https://plus.unsplash.com/premium_photo-1726105464703-47af74d239c2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'forest, travel, trees, hiking, calm, foggy forest, peaceful, tourism, greenery, natural beauty, biodiversity, ecosystem, pacific northwest, wilderness, woodland, forest path, serenity, travel destination, hiking trail, tranquility image'),
('https://cdn.pixabay.com/photo/2017/08/17/08/08/camp-2650359_1280.jpg', 'camp, camping, campsite, tent, mountains, iceland, scenic view, landscape, adventure, nature, outdoors image');

