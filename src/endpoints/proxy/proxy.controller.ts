import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GatewayService } from "src/helpers/gateway.service";
import * as fastify from 'fastify';
import { VmQueryRequest } from "../vm.query/entities/vm.query.request";
import { VmQueryService } from "../vm.query/vm.query.service";

@Controller()
@ApiTags('proxy')
export class ProxyController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly vmQueryService: VmQueryService
  ) {}

  @Get('/address/:address')
  async getAddress(@Res() res: fastify.FastifyReply, @Param('address') address: string) {
    await this.gatewayGet(res, `address/${address}`);
  }

  @Get('/address/:address/balance')
  async getAddressBalance(@Res() res: fastify.FastifyReply, @Param('address') address: string) {
    await this.gatewayGet(res, `address/${address}/balance`);
  }

  @Get('/address/:address/nonce')
  async getAddressNonce(@Res() res: fastify.FastifyReply, @Param('address') address: string) {
    await this.gatewayGet(res, `address/${address}/nonce`);
  }

  @Get('/address/:address/shard')
  async getAddressShard(@Res() res: fastify.FastifyReply, @Param('address') address: string) {
    await this.gatewayGet(res, `address/${address}/shard`);
  }

  @Get('/address/:address/storage/:key')
  async getAddressStorageKey(@Res() res: fastify.FastifyReply, @Param('address') address: string, @Param('key') key: string) {
    await this.gatewayGet(res, `address/${address}/storage/${key}`);
  }

  @Get('/address/:address/transactions')
  async getAddressTransactions(@Res() res: fastify.FastifyReply, @Param('address') address: string) {
    await this.gatewayGet(res, `address/${address}/transactions`);
  }

  @Get('/address/:address/esdt')
  async getAddressEsdt(@Res() res: fastify.FastifyReply, @Param('address') address: string) {
    await this.gatewayGet(res, `address/${address}/esdt`);
  }

  @Post('/transaction/send')
  async transactionSend(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'transaction/send', body);
  }

  @Post('/transaction/simulate')
  async transactionSimulate(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'transaction/simulate', body);
  }

  @Post('/transaction/send-multiple')
  async transactionSendMultiple(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'transaction/send-multiple', body);
  }

  @Post('/transaction/send-user-funds')
  async transactionSendUserFunds(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'transaction/send-user-funds', body);
  }

  @Post('/transaction/cost')
  async transactionCost(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'transaction/cost', body);
  }

  @Get('/transaction/:hash')
  @ApiQuery({ name: 'sender', description: 'Sender', required: false })
  @ApiQuery({ name: 'withResults', description: 'Include results which correspond to the hash', required: false })
  async getTransaction(
    @Res() res: fastify.FastifyReply, 
    @Param('hash') hash: string,
    @Query('sender') sender: string | undefined,
    @Query('withResults') withResults: string | undefined,
  ) {
    await this.gatewayGet(res, `transaction/${hash}`, { sender, withResults });
  }

  @Get('/transaction/:hash/status')
  @ApiQuery({ name: 'sender', description: 'Sender', required: false })
  async getTransactionStatus(
    @Res() res: fastify.FastifyReply, 
    @Param('hash') hash: string,
    @Query('sender') sender: string,
  ) {
    await this.gatewayGet(res, `transaction/${hash}`, { sender });
  }

  @Post('/vm-values/hex')
  async vmValuesHex(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'vm-values/hex', body);
  }

  @Post('/vm-values/string')
  async vmValuesString(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'vm-values/string', body);
  }

  @Post('/vm-values/int')
  async vmValuesInt(@Res() res: fastify.FastifyReply, @Body() body: any) {
    await this.gatewayPost(res, 'vm-values/int', body);
  }

  @Post('/vm-values/query')
  @ApiResponse({
    status: 201,
    description: 'Returns the result of the query (legacy)',
  })
  async queryLegacy(@Body() query: VmQueryRequest, @Res() res: fastify.FastifyReply) {
    try {
      let result = await this.vmQueryService.vmQueryFullResult(query.scAddress, query.funcName, query.caller, query.args);
      res.status(HttpStatus.OK).send(result);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error.response.data);
    }
  }

  @Get('/network/status/:shard')
  async getNetworkStatusShard(@Res() res: fastify.FastifyReply, @Param('shard') shard: string) {
    await this.gatewayGet(res, `network/status/${shard}`);
  }

  @Get('/network/config')
  async getNetworkConfig(@Res() res: fastify.FastifyReply) {
    await this.gatewayGet(res, 'network/config');
  }

  @Get('/network/economics')
  async getNetworkEconomics(@Res() res: fastify.FastifyReply) {
    await this.gatewayGet(res, 'network/economics');
  }

  @Get('/network/total-staked')
  async getNetworkTotalStaked(@Res() res: fastify.FastifyReply) {
    await this.gatewayGet(res, 'network/total-staked');
  }

  @Get('/node/heartbeatstatus')
  async getNodeHeartbeatStatus(@Res() res: fastify.FastifyReply) {
    await this.gatewayGet(res, 'node/heartbeatstatus');
  }

  // @Get('/validator/statistics')
  // async getValidatorStatistics(@Res() res: fastify.FastifyReply) {
  //   await this.gatewayGet(res, 'validator/statistics');
  // }

  @Get('/block/:shard/by-nonce/:nonce')
  @ApiQuery({ name: 'withTxs', description: 'Include transactions', required: false })
  async getBlockByShardAndNonce(
    @Res() res: fastify.FastifyReply, 
    @Param('shard') shard: string,
    @Param('nonce') nonce: number,
    @Query('withTxs') withTxs: string | undefined,
  ) {
    await this.gatewayGet(res, `block/${shard}/by-nonce/${nonce}`, { withTxs });
  }

  @Get('/block/:shard/by-hash/:hash')
  @ApiQuery({ name: 'withTxs', description: 'Include transactions', required: false })
  async getBlockByShardAndHash(
    @Res() res: fastify.FastifyReply, 
    @Param('shard') shard: string,
    @Param('hash') hash: number,
    @Query('withTxs') withTxs: string | undefined,
  ) {
    await this.gatewayGet(res, `block/${shard}/by-hash/${hash}`, { withTxs });
  }

  @Get('/block-atlas/:shard/:nonce')
  async getBlockAtlas(
    @Res() res: fastify.FastifyReply, 
    @Param('shard') shard: string,
    @Param('nonce') nonce: number,
  ) {
    await this.gatewayGet(res, `block-atlas/${shard}/${nonce}`);
  }

  @Get('/hyperblock/by-nonce/:nonce')
  async getHyperblockByNonce(@Res() res: fastify.FastifyReply, @Param('nonce') nonce: number) {
    await this.gatewayGet(res, `hyperblock/by-nonce/${nonce}`);
  }

  @Get('/hyperblock/by-hash/:hash')
  async getHyperblockByHash(@Res() res: fastify.FastifyReply, @Param('hash') hash: number) {
    await this.gatewayGet(res, `hyperblock/by-hash/${hash}`);
  }

  private async gatewayGet(@Res() res: fastify.FastifyReply, url: string, params: any = undefined) {
    if (params) {
      url += '?' + Object.keys(params).filter(key => params[key] !== undefined).map(key => `${key}=${params[key]}`).join('&')
    }

    try {
      let result = await this.gatewayService.getRaw(url);
      res.send(result.data);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error.response.data);
    }
  }

  private async gatewayPost(@Res() res: fastify.FastifyReply, url: string, data: any) {
    try {
      let result = await this.gatewayService.createRaw(url, data);
      res.send(result.data);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(error.response.data);
    }
  }
}