import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret:
    '9f2e6c1b5dfb3d8c71b6e4308e3dc7e561b6c0131bb7a3c9e68c3aaebbf35296f7231aa1b8a7a1b58dfd2344ea05f68c7b90dd4fc93e8a95d74857f7c02ddccf',
};
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
