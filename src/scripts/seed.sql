-- =============================================
-- Seed Data: Categories and Products
-- =============================================

INSERT INTO categories (name) VALUES
('Backpacks'),
('Tents'),
('Sleep Systems'),
('Camp Essentials'),
('Accessories & Tools');

INSERT INTO products (name, description, price, category_id, image_url, featured) VALUES
(
    'Northface 45L Pack',
    'Lightweight 45L hiking pack with ventilated back panel and removable rain cover.',
    129.99,
    (SELECT id FROM categories WHERE name = 'Backpacks'),
    'https://www.rei.com/media/fd07bf0a-b3c9-4a92-a984-8dce9ba7faa4.jpg?size=1500',
    TRUE
),

(
    'Ridgeline 2P Tent',
    'Freestanding two-person tent with aluminum poles and full-coverage fly.',
    219.00,
    (SELECT id FROM categories WHERE name = 'Tents'),
    'https://www.rei.com/media/1e47bd14-a38d-42f2-8f0f-94fdb980a983.jpg?size=1500',
    TRUE
),

(
    'NEMO Disco 15 Sleeping Bag',
    'Down sleeping bag rated for cold-weather backpacking.',
    149.50,
    (SELECT id FROM categories WHERE name = 'Sleep Systems'),
    'https://www.rei.com/media/8ff133cb-9a2a-44b7-a6a7-38f4096d3a27.jpg?size=1500',
    FALSE
),

(
    'Boundary Deluxe Air Pad',
    'Ultralight inflatable sleeping pad with integrated pump sack.',
    89.95,
    (SELECT id FROM categories WHERE name = 'Sleep Systems'),
    'https://www.rei.com/media/1d86ca9c-1b63-4339-ace5-fd15687753bc?size=2000',
    FALSE
),

(
    'Soto Cookset',
    'Two-pot anodized aluminum cookset with nesting bowls and lid.',
    64.00,
    (SELECT id FROM categories WHERE name = 'Camp Essentials'),
    'https://www.rei.com/media/e9858a2a-b89b-4844-bb77-de1d87c9ad87.jpg',
    FALSE
),

(
    'Hibear 32oz Bottle',
    'Insulated stainless steel bottle keeps drinks cold for 24 hours.',
    29.95,
    (SELECT id FROM categories WHERE name = 'Camp Essentials'),
    'https://www.rei.com/media/5dd36537-663d-4e83-b2b2-61e247f219c2.jpg?size=1500',
    TRUE
),

(
    'Sawyer Filter',
    'Compact water filter for backcountry use.',
    54.99,
    (SELECT id FROM categories WHERE name = 'Camp Essentials'),
    'https://www.rei.com/media/f50e522f-4bad-415e-ad95-dd376cb53fe7.jpg?size=1500',
    FALSE
),

(
    'Black Diamond Headlamp',
    '300-lumen rechargeable headlamp.',
    39.00,
    (SELECT id FROM categories WHERE name = 'Accessories & Tools'),
    'https://www.rei.com/media/c5b8e825-8595-42fb-a541-1a67fc9f0cd7.jpg?size=1500',
    FALSE
),

(
    'Leki Trek Poles',
    'Carbon fiber trekking poles with cork grips.',
    119.00,
    (SELECT id FROM categories WHERE name = 'Accessories & Tools'),
    'https://www.rei.com/media/c17a38d9-578d-4714-bb75-f1db1285bf6f.jpg?size=1500',
    FALSE
),

(
    'Skeletool CX Multi-Tool',
    'Pocket multi-tool with knife and pliers.',
    24.95,
    (SELECT id FROM categories WHERE name = 'Accessories & Tools'),
    'https://www.rei.com/media/6ec306a4-fcfb-4575-9d8b-15b0c8377b95.jpg?size=1500',
    FALSE
),

(
    'Glacier 45 Cooler',
    'Rotomolded cooler keeps ice for up to 4 days.',
    189.00,
    (SELECT id FROM categories WHERE name = 'Camp Essentials'),
    'https://www.rei.com/media/1892dfe9-e503-490f-975a-cf186af22f59.jpg?size=1500',
    TRUE
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

